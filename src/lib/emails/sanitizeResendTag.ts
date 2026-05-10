/**
 * Tags Resend : ASCII [a-zA-Z0-9_-], max 256 chars (on tronque à 50 pour les valeurs longues).
 * @see https://resend.com/docs/dashboard/emails/tags
 */
export function sanitizeResendTag(raw: string): string {
  let s = raw.trim()
  if (!s) return 'unknown'
  s = s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  s = s.replace(/œ/g, 'oe').replace(/Œ/g, 'OE').replace(/æ/g, 'ae').replace(/Æ/g, 'AE')
  s = s.replace(/\s+/g, '_')
  s = s.replace(/[^a-zA-Z0-9_-]/g, '')
  return (s || 'unknown').slice(0, 50)
}

export function sanitizeResendTagEntries(
  entries: ReadonlyArray<{ name: string; value: string }>,
): Array<{ name: string; value: string }> {
  return entries.map((t) => ({
    name: sanitizeResendTag(t.name),
    value: sanitizeResendTag(t.value),
  }))
}
