import { useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export const useParallax = (speed: number = 0.5) => {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed])

    return { ref, y }
}