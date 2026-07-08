import Link from "next/link"

import { siteConfig } from "@/data/site"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-secondary">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {siteConfig.footer.copyright}
          </p>
          <p className="text-sm text-muted-foreground">
            {siteConfig.footer.tagline}
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-4">
          {siteConfig.footer.links.map((link) => (
            <li key={link.label}>
              {link.href.startsWith("/") ? (
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  {...(link.href.endsWith(".pdf")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
