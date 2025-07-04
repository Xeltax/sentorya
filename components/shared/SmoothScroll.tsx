'use client'

import { ReactNode } from 'react'
import { useLenis } from '@/hooks/useLenis'

interface SmoothScrollProps {
    children: ReactNode
}

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
    useLenis()
    return <>{children}</>
}