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

export interface StackLayer {
  layer: string
  detail: string
}

/** The stack a hiring reader checks, shown under Capabilities. */
export interface WorkingRange {
  role: string
  note: string
  layers: StackLayer[]
}

/** One piece of the headline. Only a single segment should carry the accent. */
export interface HeadlineSegment {
  text: string
  accent?: boolean
  /** Start a new visual line in the hero. */
  break?: boolean
  /** Keep this segment on one line (no mid-phrase wrap). */
  nowrap?: boolean
  /** Indent this line on the broken composition. */
  offset?: boolean
}

/** One stratum of the hero product stack. */
export interface HeroLayer {
  label: string
  detail: string
}

export interface HeroContent {
  badge: string
  /** Small label above the headline. Optional — omit for a cleaner hero. */
  kicker?: string
  wordmark: string
  surname: string
  headline: HeadlineSegment[]
  tagline: string | readonly string[]
  availability: string
  availabilityHref?: string
  /** Eyebrow above the product stack. */
  systemLabel: string
  /** How a product is shipped — the hero motion object. */
  layers: HeroLayer[]
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
  keywords: string[]
  siteName: string
  locale: string
  ogImage: string
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
  liveUrl?: string
  githubUrl?: string
  /** Sole homepage flagship when true */
  featured?: boolean
  subtitle?: string
  problem?: string
  /** Editorial beats for the problem statement (one line per beat). */
  problemLines?: string[]
  approachHeadline?: string
  approachLead?: string
  approachSteps?: ApproachStep[]
  decisions?: string[]
  shippedFlowHub?: ShippedFlowHub
  shippedFlow?: ShippedFlowNode[]
}

export interface ApproachStep {
  title: string
  detail: string
}

export type ShippedFlowIcon =
  | "code"
  | "shield"
  | "database"
  | "zap"
  | "cloud"
  | "sparkles"
  | "test"
  | "deploy"

export type ShippedFlowAccent = "cyan" | "violet" | "green" | "purple" | "amber"

export interface ShippedFlowArchitectureStep {
  label: string
  active?: boolean
}

export interface ShippedFlowNode {
  id: string
  index: number
  title: string
  detail: string
  /** Primary tech line on the grid card. */
  cardStack: string
  /** Secondary feature line on the grid card. */
  cardFeatures: string
  icon: ShippedFlowIcon
  accent: ShippedFlowAccent
  description: string
  bullets: string[]
  architecture: ShippedFlowArchitectureStep[]
  /** Other node ids this module connects to in the flow diagram. */
  connectsTo: string[]
}

export interface ShippedFlowHub {
  title: string
  subtitle: string
}

export interface SkillGroup {
  id: string
  title: string
  summary: string
  skills: string[]
}

export interface ContactFormValues {
  name: string
  email: string
  message: string
}

export interface SectionMeta {
  title: string
  description?: string
}

export interface AboutHighlight {
  label: string
  value: string
}

export type AboutAccent = "gold" | "amber" | "ember"

export interface AboutFeatureCard {
  title: string
  detail: string
  accent: AboutAccent
  icon: import("lucide-react").LucideIcon
}

export interface AboutRadarAxis {
  label: string
  value: number
}

export interface AboutStat {
  value: string
  label: string
}

export interface AboutImpactPanel {
  floatBadge: string
  title: string
  liveBadge: string
  stats: AboutStat[]
}

export interface AboutContent {
  kicker: string
  headline: {
    lead: string
    accent: string
  }
  section: SectionMeta
  featureCards: AboutFeatureCard[]
  impact: AboutImpactPanel
  radarAxes: AboutRadarAxis[]
}

export interface ContactFormField {
  name: keyof ContactFormValues
  label: string
  placeholder: string
}

export interface ContactContent {
  section: SectionMeta
  fields: ContactFormField[]
  submitLabel: string
  submittingLabel: string
  successMessage: string
  errorMessage: string
  missingKeyMessage: string
}

export interface SectionContent {
  skills: SectionMeta
  experience: SectionMeta
}

export interface ProjectActions {
  liveDemo: string
  github: string
}
