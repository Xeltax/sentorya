'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface ScrollTriggerProps {
    children: ReactNode
    className?: string
    transformY?: [number, number]
    transformScale?: [number, number]
    transformOpacity?: [number, number]
}

export const ScrollTrigger = ({
                                  children,
                                  className,
                                  transformY = [100, 0],
                                  transformScale = [0.8, 1],
                                  transformOpacity = [0, 1]
                              }: ScrollTriggerProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], transformY)
    const scale = useTransform(scrollYProgress, [0, 0.5], transformScale)
    const opacity = useTransform(scrollYProgress, [0, 0.3], transformOpacity)

    return (
        <motion.div
            ref={ref}
            style={{ y, scale, opacity }}
            className={className}
        >
            {children}
        </motion.div>
    )
}