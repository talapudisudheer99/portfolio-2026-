import type { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  metadata: {
    title: "Sudheer Talapudi | Frontend Engineer & Product Builder",
    description:
      "Frontend engineer building polished interfaces and complete product systems. Creator of Sameward — Next.js, realtime, auth, AI, and production infrastructure.",
    keywords: [
      "Sudheer Talapudi",
      "Frontend Engineer",
      "Sameward",
      "Next.js",
      "TypeScript",
      "React",
      "RTK Query",
      "Socket.IO",
      "Full Stack",
      "Hyderabad",
      "Portfolio",
    ],
    siteName: "Sudheer Talapudi Portfolio",
    locale: "en_IN",
    ogImage: "/opengraph-image",
  },
  contact: {
    name: "Sudheer Talapudi",
    phone: "+91 9676234130",
    email: "sudheertalaudi@gmail.com",
    location: "Hyderabad, India (Open to Remote)",
  },
  navLinks: [
    { label: "Work", href: "#projects" },
    { label: "Capabilities", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Profile", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  socialLinks: [
    {
      label: "GitHub",
      href: "https://github.com/talapudisudheer99",
      icon: "github",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/talapudisudheer99",
      icon: "linkedin",
    },
    {
      label: "Email",
      href: "mailto:sudheertalaudi@gmail.com",
      icon: "email",
    },
  ],
  hero: {
    badge: "Sudheer Talapudi · Hyderabad / Remote",
    greeting: "Frontend engineer. Full product thinker.",
    role: "Next.js · TypeScript · Realtime · AI",
    tagline:
      "I turn complex product requirements into clear, production-ready experiences—from interface systems to the infrastructure behind them.",
    ctas: [
      {
        label: "View Sameward",
        href: "https://sameward.com/",
        variant: "primary",
        external: true,
      },
      {
        label: "Download Resume",
        href: "/resume.pdf",
        variant: "outline",
        external: true,
      },
    ],
  },
  footer: {
    copyright: "© 2026 Sudheer Talapudi",
    tagline: "Designed and built with care in Hyderabad.",
    links: [
      { label: "Resume", href: "/resume.pdf" },
      {
        label: "Sameward",
        href: "https://sameward.com/",
      },
      {
        label: "GitHub",
        href: "https://github.com/talapudisudheer99",
      },
      {
        label: "LinkedIn",
        href: "https://linkedin.com/in/talapudisudheer99",
      },
      { label: "Email", href: "mailto:sudheertalaudi@gmail.com" },
    ],
  },
  resume: {
    label: "Download Resume",
    href: "/resume.pdf",
  },
  labels: {
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    toggleTheme: "Toggle color theme",
    skipToContent: "Skip to main content",
  },
}
