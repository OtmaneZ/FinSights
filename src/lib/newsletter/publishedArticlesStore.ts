import fs from 'fs/promises'
import path from 'path'

export interface PublishedArticleRecord {
  slug: string
  newsletterSent: boolean
  sentAt: string
}

interface PublishedArticlesState {
  records: PublishedArticleRecord[]
}

const STORE_PATH = path.join(process.cwd(), 'data', 'newsletter-published-articles.json')

const EMPTY_STATE: PublishedArticlesState = {
  records: [],
}

async function ensureStoreFile() {
  try {
    await fs.access(STORE_PATH)
  } catch {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true })
    await fs.writeFile(STORE_PATH, JSON.stringify(EMPTY_STATE, null, 2), 'utf-8')
  }
}

export async function loadPublishedArticlesState(): Promise<PublishedArticlesState> {
  await ensureStoreFile()
  const raw = await fs.readFile(STORE_PATH, 'utf-8')

  try {
    const parsed = JSON.parse(raw) as PublishedArticlesState
    if (!Array.isArray(parsed.records)) {
      return { ...EMPTY_STATE }
    }
    return parsed
  } catch {
    return { ...EMPTY_STATE }
  }
}

export async function wasNewsletterSentForSlug(slug: string): Promise<boolean> {
  const state = await loadPublishedArticlesState()
  const found = state.records.find((r) => r.slug === slug)
  return Boolean(found?.newsletterSent)
}

export async function markNewsletterSentForSlug(slug: string): Promise<void> {
  const state = await loadPublishedArticlesState()
  const now = new Date().toISOString()
  const existing = state.records.find((r) => r.slug === slug)

  if (existing) {
    existing.newsletterSent = true
    existing.sentAt = now
  } else {
    state.records.push({
      slug,
      newsletterSent: true,
      sentAt: now,
    })
  }

  await fs.writeFile(STORE_PATH, JSON.stringify(state, null, 2), 'utf-8')
}
