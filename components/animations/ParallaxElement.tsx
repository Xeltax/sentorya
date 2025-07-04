'use client'

import { motion } from 'framer-motion'
import { useParallax } from '@/hooks/useParallax'
import { ReactNode } from 'react'

interface ParallaxElementProps {
    children: ReactNode
    speed?: number
    className?: string
}

export const ParallaxElement = ({
                                    children,
                                    speed = 0.5,
                                    className
                                }: ParallaxElementProps) => {
    const { ref, y } = useParallax(speed)

    return (
        <motion.div
            ref={ref}
            style={{ y }}
            className={className}
        >
            {children}
        </motion.div>
    )
}