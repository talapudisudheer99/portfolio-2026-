import type { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  metadata: {
    title: "Sudheer Talapudi | Frontend Engineer",
    description:
      "Frontend engineer with 3 years of experience building enterprise web platforms with Next.js, TypeScript, GraphQL, and modern React architecture.",
  },
  contact: {
    name: "Sudheer Talapudi",
    phone: "+91 9676234130",
    email: "sudheertalaudi@gmail.com",
    location: "Hyderabad, India (Open to Remote)",
  },
  navLinks: [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
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
    badge: "Frontend Engineer",
    greeting: "Hi, I'm Sudheer",
    role: "Frontend Engineer · Next.js · TypeScript · GraphQL",
    tagline:
      "3 years building enterprise web platforms — currently shipping dual Next.js applications with GraphQL, real-time updates, and production-grade frontend architecture.",
    ctas: [
      {
        label: "Download Resume",
        href: "/resume.pdf",
        variant: "primary",
        external: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/talapudisudheer99",
        variant: "outline",
        external: true,
      },
      {
        label: "LinkedIn",
        href: "https://linkedin.com/in/talapudisudheer99",
        variant: "outline",
        external: true,
      },
      {
        label: "Contact",
        href: "#contact",
        variant: "ghost",
      },
    ],
  },
  footer: {
    copyright: "© 2026 Sudheer Talapudi",
    tagline: "Built with Next.js & shadcn/ui",
    links: [
      { label: "Resume", href: "/resume.pdf" },
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
