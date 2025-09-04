"use client";

import {useTransform} from "framer-motion";
import {motion, useScroll} from "framer-motion";
import {useRef} from "react";
import {staggerContainer, slideUp} from '@/utils/scrollAnimations'
import {StaggeredText} from "@/components/animations/StaggeredText";
import {AnimateOnScroll} from "@/components/animations/AnimateOnScroll";
import {CheckCircle, Crown, Settings, Shield, ShieldAlert, ShieldCheck} from "lucide-react";
import {NavBar} from "@/components/shared/Navbar";
import {Navigation} from "@/components/landing/Navigation";
import {Hero} from "@/components/landing/Hero";
import {Services} from "@/components/landing/Services";
import {Contact} from "@/components/landing/Contact";
import {Pricing} from "@/components/landing/Pricing";

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main>
                <Hero />
                <Services />
                <Pricing/>
                <Contact />
            </main>
        </div>
    );
}


