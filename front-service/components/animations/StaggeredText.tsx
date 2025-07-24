'use client'

import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'

interface StaggeredTextProps {
    text: string
    className?: string
}

export const StaggeredText = ({ text, className }: StaggeredTextProps) => {
    const { ref, isInView } = useInView()

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.03,
                delayChildren: 0.1
            }
        }
    }

    const child = {
        hidden: {
            opacity: 0,
            y: 20,
            rotateX: 90
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        }
    }

    return (
        <motion.div
            ref={ref}
            variants={container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={className}
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    // @ts-expect-error("framer-motion types do not match")
                    variants={child}
                    style={{ display: "inline-block" }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.div>
    )
}