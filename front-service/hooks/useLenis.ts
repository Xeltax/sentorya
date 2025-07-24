import { useEffect } from 'react'
import Lenis from 'lenis'

export const useLenis = () => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t : any) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
            smoothWheel: true,
        })

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [])
}