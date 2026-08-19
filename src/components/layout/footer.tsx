"use client"

import Link from "next/link"

import { ContentRail } from "@/components/shared/section-wrapper"
import { ParallaxFooter } from "@/components/shared/parallax"
import { siteConfig } from "@/data/site"

export function Footer() {
  return (
    <ParallaxFooter className="section-rule">
      <ContentRail className="flex flex-col gap-7 py-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground">
            {siteConfig.footer.copyright}
          </p>
          <p className="text-sm text-muted-foreground">
            {siteConfig.footer.tagline}
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {siteConfig.footer.links.map((link) => (
            <li key={link.label}>
              {link.href.startsWith("/") ? (
                <Link
                  href={link.href}
                  className="rounded-sm text-xs font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  {...(link.href.endsWith(".pdf")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="rounded-sm text-xs font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </ContentRail>
    </ParallaxFooter>
  )
}
