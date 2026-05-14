import 'dotenv/config'
import { BLOG_ARTICLES } from '@/lib/seo'
import {
  markNewsletterSentForSlug,
  wasNewsletterSentForSlug,
} from '@/lib/newsletter/publishedArticlesStore'

const SITE_URL = 'https://finsight.zineinsight.com'

function getArgs() {
  const [slugArg, ...rest] = process.argv.slice(2)
  const force = rest.includes('--force')

  return {
    slug: slugArg,
    force,
  }
}

function excerptFromDescription(description: string): string {
  const clean = description.replace(/\s+/g, ' ').trim()
  if (clean.length <= 300) return clean
  return `${clean.slice(0, 297)}...`
}

async function run() {
  const { slug, force } = getArgs()

  if (!slug) {
    console.error('Usage: npx tsx scripts/publish-article.ts <slug> [--force]')
    process.exit(1)
  }

  const article = BLOG_ARTICLES.find((a) => a.slug === slug)

  if (!article) {
    console.error(`Article introuvable pour le slug: ${slug}`)
    process.exit(1)
  }

  const alreadySent = await wasNewsletterSentForSlug(slug)
  if (alreadySent && !force) {
    console.log(`Newsletter deja envoyee pour ${slug}. Ajoutez --force pour renvoyer.`)
    process.exit(0)
  }

  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    console.error('CRON_SECRET manquant dans l\'environnement')
    process.exit(1)
  }

  const articleUrl = `${SITE_URL}/blog/${article.slug}`
  const summary = excerptFromDescription(article.description)

  try {
    const response = await fetch(`${SITE_URL}/api/automation/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cronSecret}`,
      },
      body: JSON.stringify({
        weeklyContent: {
          recurring: {
            title: article.title,
            url: articleUrl,
            summary,
          },
        },
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      console.error('Erreur trigger newsletter:', response.status, data)
      process.exit(1)
    }

    await markNewsletterSentForSlug(slug)

    console.log('Publication traitee avec succes')
    console.log(JSON.stringify({
      slug,
      articleUrl,
      newsletterTriggered: true,
      stats: data?.stats ?? null,
    }, null, 2))
  } catch (error) {
    console.error('Echec envoi newsletter (non bloquant publication):', error)
    process.exit(1)
  }
}

run().catch((error) => {
  console.error('Erreur script publish-article:', error)
  process.exit(1)
})
