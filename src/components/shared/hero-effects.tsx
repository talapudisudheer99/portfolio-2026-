"use client"

import { motion, useReducedMotion } from "framer-motion"

import { easeOut, staggerContainer } from "@/lib/motion"

export function HeroBackground() {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--primary-light)_0%,_transparent_65%)] opacity-70 dark:opacity-35"
      />
    )
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="hero-grid absolute inset-0 opacity-40 dark:opacity-20" />
      <motion.div
        className="absolute -top-24 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_var(--primary)_0%,_transparent_70%)] opacity-20 blur-3xl dark:opacity-30"
        animate={{ scale: [1, 1.08, 1], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-32 -right-20 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/15"
        animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-48 -left-16 h-48 w-48 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-500/10"
        animate={{ x: [0, 25, 0], y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

interface HeroStaggerProps {
  children: React.ReactNode
  className?: string
}

export function HeroStagger({ children, className }: HeroStaggerProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      transition={{ delayChildren: 0.15 }}
    >
      {children}
    </motion.div>
  )
}

export function HeroItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: easeOut },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
