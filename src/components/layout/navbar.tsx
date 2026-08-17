"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowDownToLine, Menu } from "lucide-react"

import { ContentRail } from "@/components/shared/section-wrapper"
import { ScrollProgress } from "@/components/shared/scroll-progress"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { siteConfig } from "@/data/site"

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="surface-chrome relative sticky top-0 z-50 border-b border-border/70">
      <ContentRail>
        <nav
          aria-label="Main navigation"
          className="flex h-18 items-center justify-between"
        >
          <Link
            href="/"
            className={`font-heading text-sm font-extrabold tracking-[-0.04em] text-foreground transition-colors hover:text-primary md:text-base ${focus}`}
          >
            Sudheer<span className="text-primary">.</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <ul className="flex items-center gap-6">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground ${focus}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <ThemeToggle />
            <a
              href={siteConfig.resume.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 text-xs font-bold text-foreground transition-colors hover:text-primary ${focus}`}
            >
              Resume
              <ArrowDownToLine className="size-4" aria-hidden="true" />
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-10 rounded-full"
                    aria-label={siteConfig.labels.openMenu}
                  />
                }
              >
                <Menu className="size-5" aria-hidden="true" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="surface-chrome w-full max-w-sm"
              >
                <SheetHeader>
                  <SheetTitle className="editorial-display text-3xl">
                    Navigate
                  </SheetTitle>
                </SheetHeader>
                <ul className="flex flex-col px-4">
                  {siteConfig.navLinks.map((link, index) => (
                    <li key={link.href} className="border-b border-border">
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between py-5 text-lg font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        {link.label}
                        <span className="font-mono text-[10px] text-muted-foreground">
                          0{index + 1}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="px-4 pt-7">
                  <a
                    href={siteConfig.resume.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-primary"
                  >
                    Download resume
                    <ArrowDownToLine className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </ContentRail>
      <ScrollProgress />
    </header>
  )
}
