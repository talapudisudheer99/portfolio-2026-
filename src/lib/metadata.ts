import type { Metadata } from "next"

import { siteConfig } from "@/data/site"
import { getSiteUrl } from "@/lib/site-url"

const siteUrl = getSiteUrl()
const { metadata, contact, socialLinks, hero } = siteConfig
const ogImage = metadata.ogImage
const ogAlt = `${contact.name} — Frontend engineer who shipped Sameward`

export function createSiteMetadata(): Metadata {
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
    formatDetection: {
      email: false,
      telephone: false,
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
          alt: ogAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [{ url: ogImage, alt: ogAlt }],
    },
  }
}

export function createJsonLd() {
  const sameAs = [
    ...socialLinks.map((link) => link.href).filter((href) => !href.startsWith("mailto:")),
    hero.ctas.find((cta) => cta.external)?.href,
  ].filter((href): href is string => Boolean(href))

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: contact.name,
        jobTitle: "Frontend Engineer",
        description: metadata.description,
        url: siteUrl,
        email: contact.email,
        telephone: contact.phone,
        sameAs,
        knowsAbout: [
          "React",
          "Next.js",
          "TypeScript",
          "Realtime systems",
          "Product engineering",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Hyderabad",
          addressCountry: "IN",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: metadata.siteName,
        description: metadata.description,
        inLanguage: "en-IN",
        publisher: { "@id": `${siteUrl}/#person` },
      },
    ],
  }
}
