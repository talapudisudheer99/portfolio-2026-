"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowDownToLine, Menu, X } from "lucide-react"

import { PaletteSelect } from "@/components/layout/palette-select"
import { siteConfig } from "@/data/site"
import { cn } from "@/lib/utils"

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeHref, setActiveHref] = useState("")

  useEffect(() => {
    const sections = siteConfig.navLinks
      .map((link) => document.querySelector<HTMLElement>(link.href))
      .filter((section): section is HTMLElement => section !== null)

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        const id = visible[0]?.target.id
        if (id) setActiveHref(`#${id}`)
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: [0.12, 0.35, 0.6] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <header className="nav-header">
        <nav aria-label="Main navigation" className="nav-pill">
          <Link href="/" className={`nav-logo ${focus}`} data-cursor="Home">
            S<span className="nav-logo-dot">.</span>
          </Link>

          <span aria-hidden="true" className="nav-divider nav-divider--desktop" />

          <ul className="nav-links">
            {siteConfig.navLinks.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "nav-link",
                    focus,
                    activeHref === link.href && "is-active"
                  )}
                  data-cursor={link.label}
                  aria-current={activeHref === link.href ? "page" : undefined}
                >
                  <span className="nav-link-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <span aria-hidden="true" className="nav-divider nav-divider--desktop" />

          <div className="nav-right">
            <PaletteSelect />
            <a
              href={siteConfig.resume.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`nav-resume ${focus}`}
              data-cursor="Download"
            >
              <ArrowDownToLine className="size-3.5" aria-hidden="true" />
              <span className="nav-resume-text">CV</span>
            </a>

            <button
              type="button"
              className="nav-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : siteConfig.labels.openMenu}
            >
              {mobileOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <motion.div
          className="nav-mobile-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <motion.div
        className="nav-mobile-panel"
        initial={false}
        animate={{
          y: mobileOpen ? 0 : "-110%",
          opacity: mobileOpen ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <ul className="nav-mobile-links">
          {siteConfig.navLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="nav-mobile-link"
              >
                <span className="nav-mobile-index">{String(i + 1).padStart(2, "0")}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={siteConfig.resume.href}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-mobile-resume"
        >
          Download resume
          <ArrowDownToLine className="size-4" aria-hidden="true" />
        </a>
      </motion.div>
    </>
  )
}
