'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { useEffect, useState } from 'react'

export const NavBar = () => {
    const { scrollY } = useScroll()
    const scrollDirection = useScrollDirection()
    const [isScrolled, setIsScrolled] = useState(false)

    const backgroundColor = useTransform(
        scrollY,
        [0, 100],
        ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']
    )

    const y = useTransform(
        scrollY,
        [0, 100],
        scrollDirection === 'down' ? [-100, 0] : [0, 0]
    )

    useEffect(() => {
        const unsubscribe = scrollY.onChange((latest) => {
            setIsScrolled(latest > 50)
        })
        return unsubscribe
    }, [scrollY])

    return (
        <motion.nav
            style={{ backgroundColor, y }}
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        >
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold"
                    >
                        Sentorya
                    </motion.div>

                    <motion.div
                        animate={{ scale: isScrolled ? 0.9 : 1 }}
                        className="flex space-x-6"
                    >
                        {['Accueil', 'À propos', 'Services', 'Contact'].map((item) => (
                            <motion.a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-gray-700 hover:text-blue-500 transition-colors"
                            >
                                {item}
                            </motion.a>
                        ))}
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    )
}