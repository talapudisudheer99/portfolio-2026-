import type { Metadata } from "next"

import { siteConfig } from "@/data/site"
import { getSiteUrl } from "@/lib/site-url"

const siteUrl = getSiteUrl()
const { metadata, contact } = siteConfig

export function createSiteMetadata(): Metadata {
  const ogImage = metadata.ogImage

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: metadata.title,
      template: `%s | ${contact.name}`,
    },
    description: metadata.description,
    keywords: metadata.keywords,
    authors: [{ name: contact.name, url: siteUrl }],
    creator: contact.name,
    publisher: contact.name,
    applicationName: metadata.siteName,
    category: "technology",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: metadata.locale,
      url: siteUrl,
      siteName: metadata.siteName,
      title: metadata.title,
      description: metadata.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${contact.name} — Frontend Engineer portfolio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [ogImage],
    },
  }
}
