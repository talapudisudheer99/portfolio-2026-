export type SocialIcon = "github" | "linkedin" | "email" | "phone"

export type CtaVariant = "primary" | "outline" | "ghost"

export interface NavLink {
  label: string
  href: string
}

export interface SocialLink {
  label: string
  href: string
  icon: SocialIcon
}

export interface ContactInfo {
  name: string
  phone: string
  email: string
  location: string
}

export interface CtaLink {
  label: string
  href: string
  variant: CtaVariant
  external?: boolean
}

export interface HeroContent {
  badge: string
  greeting: string
  role: string
  tagline: string
  ctas: CtaLink[]
}

export interface FooterContent {
  copyright: string
  tagline: string
  links: NavLink[]
}

export interface ResumeConfig {
  label: string
  href: string
}

export interface SiteMetadata {
  title: string
  description: string
  ogImage?: string
}

export interface SiteLabels {
  openMenu: string
  closeMenu: string
  toggleTheme: string
  skipToContent: string
}

export interface SiteConfig {
  metadata: SiteMetadata
  contact: ContactInfo
  navLinks: NavLink[]
  socialLinks: SocialLink[]
  hero: HeroContent
  footer: FooterContent
  resume: ResumeConfig
  labels: SiteLabels
}

export interface Experience {
  id: string
  company: string
  role: string
  period: string
  bullets: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  stack: string[]
  liveUrl?: string
  githubUrl?: string
}

export interface SkillGroup {
  id: string
  title: string
  skills: string[]
}

export interface ContactFormValues {
  name: string
  email: string
  message: string
}
