/**
 * Resolves the public site URL for metadata, OG tags, and canonical links.
 * Set NEXT_PUBLIC_SITE_URL after Vercel deploy (e.g. https://portfolio-2026.vercel.app).
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")

  if (configured) {
    return configured
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return "http://localhost:3000"
}
