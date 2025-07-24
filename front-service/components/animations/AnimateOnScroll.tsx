'use client'

import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { ReactNode } from 'react'
import { fadeInUp } from '@/utils/scrollAnimations'

interface AnimateOnScrollProps {
    children: ReactNode
    animation?: any
    delay?: number
    className?: string
}

export const AnimateOnScroll = ({
                                    children,
                                    animation = fadeInUp,
                                    delay = 0,
                                    className
                                }: AnimateOnScrollProps) => {
    const { ref, isInView } = useInView()

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={animation}
            transition={{ delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}