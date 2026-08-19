"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { ArrowDownToLine, Menu, X } from "lucide-react"

import { ThemeToggle } from "@/components/shared/theme-toggle"
import { siteConfig } from "@/data/site"
const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="nav-header">
        <nav
          aria-label="Main navigation"
          className="nav-pill"
        >
          {/* Logo */}
          <Link href="/" className={`nav-logo ${focus}`} data-cursor="Home">
            S<span className="nav-logo-dot">.</span>
          </Link>

          {/* Desktop links */}
          <ul className="nav-links">
            {siteConfig.navLinks.map((link, i) => (
              <li key={link.href}>
                <a href={link.href} className={`nav-link ${focus}`} data-cursor={link.label}>
                  <span className="nav-link-index">{String(i + 1).padStart(2, "0")}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right cluster */}
          <div className="nav-right">
            <ThemeToggle />
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

            {/* Mobile toggle */}
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
