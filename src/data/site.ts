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
    greeting: "Frontend engineer. I ship complete products.",
    role: "Frontend-strong, full stack",
    tagline:
      "I take product ideas from the first screen to a live release. I build the interface, data flow, realtime features, sign-in, AI tools, and deployment.",
    availability: "Sameward live · Built end to end",
    // The span a hiring reader wants to confirm, interface through infrastructure.
    stack: [
      { layer: "Interface", detail: "React · Next.js · TypeScript" },
      { layer: "Data", detail: "REST · GraphQL · MongoDB" },
      { layer: "Live updates", detail: "Socket.IO · presence" },
      { layer: "Sign-in", detail: "Sessions · Google OAuth" },
      { layer: "AI", detail: "OpenAI · Channel AI" },
      { layer: "Launch", detail: "Railway · Vercel · AWS S3" },
    ],
    stackNote:
      "New technology joins the stack when it solves a real product need.",
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
