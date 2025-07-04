import { useScroll} from 'framer-motion'
import { useRef } from 'react'

export const useScrollAnimation = () => {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    return { ref, scrollYProgress }
}