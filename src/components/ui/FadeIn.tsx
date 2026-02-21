'use client'

import { motion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  once?: boolean
}

const getVariants = (direction: string, distance: number): Variants => {
  const initial: Record<string, number> = { opacity: 0 }

  switch (direction) {
    case 'up':
      initial.y = distance
      break
    case 'down':
      initial.y = -distance
      break
    case 'left':
      initial.x = distance
      break
    case 'right':
      initial.x = -distance
      break
  }

  return {
    hidden: initial,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  }
}

export default function FadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 30,
  once = true,
}: FadeInProps) {
  const variants = getVariants(direction, distance)

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier premium
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger container for child animations
export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ staggerChildren: staggerDelay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
