import type { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  metadata: {
    title: "Sudheer Talapudi | Frontend Engineer & Product Builder",
    description:
      "Frontend-strong engineer and creator of Sameward, building complete product systems across interfaces, data, realtime, sign-in, AI, and production.",
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
    location: "Hyderabad, India · Onsite / Hybrid / Remote",
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
    badge: "Sudheer Talapudi · Hyderabad · Onsite / Hybrid / Remote",
    wordmark: "Sudheer",
    surname: "Talapudi",
    headline: [
      { text: "I built" },
      { text: "Sameward", accent: true },
      { text: "a live product system,", break: true },
      { text: "end to end.", break: true },
    ],
    tagline: [
      "Frontend-strong engineer. Interface, realtime, auth,",
      "AI tools, and launch — shipped as one product, not a demo.",
    ],
    availability: "Sameward is live",
    availabilityHref: "https://sameward.com/",
    systemLabel: "How a product ships",
    layers: [
      { label: "Interface", detail: "Screens, states, motion" },
      { label: "Data", detail: "Queries, cache, models" },
      { label: "Realtime", detail: "Presence and events" },
      { label: "Sign-in", detail: "Sessions and access" },
      { label: "AI", detail: "Tools with product context" },
      { label: "Launch", detail: "Live in production" },
    ],
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
