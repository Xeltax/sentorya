import { useInView as useFramerInView } from 'framer-motion'
import { useRef } from 'react'

export const useInView = (options?: {
    threshold?: number
    rootMargin?: string
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useFramerInView(ref, {
        once: true,
        amount: options?.threshold || 0.1,
        // @ts-expect-error(framer-motion types do not match)
        margin: options?.rootMargin || "0px 0px -100px 0px"
    })

    return { ref, isInView }
}