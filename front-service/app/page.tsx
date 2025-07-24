"use client";

import {useTransform} from "framer-motion";
import {motion, useScroll} from "framer-motion";
import {useRef} from "react";
import {staggerContainer, slideUp} from '@/utils/scrollAnimations'
import {StaggeredText} from "@/components/animations/StaggeredText";
import {AnimateOnScroll} from "@/components/animations/AnimateOnScroll";
import {CheckCircle, Crown, Settings, Shield, ShieldAlert, ShieldCheck} from "lucide-react";
import {NavBar} from "@/components/shared/Navbar";

export default function Home() {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    })

    const cards = [
        {
            title: "Pack évaluation",
            price: "100€",
            icon: Shield,
            color: "from-blue-500 to-blue-600",
            features: [
                "1 campagne de phishing d'évaluation",
                "Diagnostic synthétique des résultats",
                "Montant déduit de tout pack acheté ensuite"
            ],
            highlight: false
        },
        {
            title: "Pack Essentiel",
            price: "740€",
            icon: ShieldCheck,
            color: "from-green-500 to-green-600",
            features: [
                "Jusqu'à 20 utilisateurs",
                "2 campagnes de phishing personnalisées",
                "2 sessions de sensibilisation + 1 offerte",
                "Un plan d'action",
                "Bilan de la mission : visio + rapport PDF"
            ],
            highlight: false
        },
        {
            title: "Pack Pro",
            price: "1 848€",
            icon: ShieldAlert,
            color: "from-purple-500 to-purple-600",
            features: [
                "De 21 à 50 utilisateurs",
                "3 campagnes de phishing ciblées",
                "3 sessions de sensibilisation + 1 offerte",
                "Dashboard privé en temps réel",
                "Téléchargement des résultats",
                "Plan d'action complet",
                "Bilan à chaque campagne + PDF détaillé"
            ],
            highlight: true
        },
        {
            title: "Pack Pro+",
            price: "3 690€",
            icon: Crown,
            color: "from-orange-500 to-orange-600",
            features: [
                "De 51 à 100 utilisateurs",
                "4 campagnes de phishing 100% personnalisées",
                "4 sessions de sensibilisation + 1 offerte",
                "Dashboard privé en temps réel",
                "Téléchargement des résultats",
                "Plan d'action complet",
                "Bilan à chaque campagne + PDF détaillé"
            ],
            highlight: false
        },
        {
            title: "Pack Sur-Mesures",
            price: "Sur devis",
            icon: Settings,
            color: "from-gray-600 to-gray-700",
            features: [
                "Pour entreprises avec besoins spécifiques",
                "Nombre de campagnes ajustables",
                "Dashboard privé en temps réel",
                "Téléchargement des résultats",
                "Plan d'action co-construit",
                "Accompagnement total durant missions",
                "Bilan à chaque campagne + PDF détaillé"
            ],
            highlight: false
        }
    ];

    const y = useTransform(scrollYProgress, [0, 1], [0, -200])
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

    return (
        <>
            <NavBar/>
            <motion.section
                ref={ref}
                style={{ y, opacity }}
                className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-blue-400 to-blue-950 text-white"
            >
                <div className="text-center z-10">
                    <StaggeredText
                        text="Solution clés en main"
                        className="text-6xl font-bold mb-4 uppercase"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="text-xl text-white-600"
                    >
                        Protéger votre entreprise des cyberattaques avant qu&apos;il ne soit trop tard.
                    </motion.p>
                </div>
            </motion.section>
            <section className="py-20 px-4">
                <AnimateOnScroll animation={staggerContainer}>
                    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                                    Nos Packs de Cybersécurité
                                </h1>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    Protégez votre entreprise avec nos solutions de phishing et de sensibilisation adaptées à vos besoins
                                </p>
                            </div>
                            {/*<motion.div*/}
                            {/*    key={index}*/}
                            {/*    variants={slideUp}*/}
                            {/*    className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow w-full max-w-sm md:w-80"*/}
                            {/*>*/}
                            <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
                                {cards.map((card, index) => {
                                    const IconComponent = card.icon;
                                    return (
                                        <motion.div
                                            key={index}
                                            variants={slideUp}
                                            className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 w-full max-w-sm transform hover:-translate-y-2 ${
                                                card.highlight ? 'ring-4 ring-purple-200 scale-105' : ''
                                            }`}
                                        >
                                            <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
                                                    {card.highlight && (
                                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                            <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                                                                ⭐ Populaire
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="p-8">
                                                        {/* Header avec icon et titre */}
                                                        <div className="text-center mb-6">
                                                            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${card.color} flex items-center justify-center shadow-lg`}>
                                                                <IconComponent className="w-8 h-8 text-white" />
                                                            </div>
                                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{card.title}</h3>
                                                            <div className="text-3xl font-bold text-gray-900 mb-1">{card.price}</div>
                                                            <div className="text-sm text-gray-500">Investissement</div>
                                                        </div>

                                                        {/* Features */}
                                                        <div className="space-y-4 mb-8">
                                                            {card.features.map((feature, featureIndex) => (
                                                                <div key={featureIndex} className="flex items-start space-x-3">
                                                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                                    <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* CTA Button */}
                                                        <button className={`w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${card.color} hover:opacity-90 transition-opacity duration-200 shadow-lg hover:shadow-xl`}>
                                                            {card.price === "Sur devis" ? "Demander un devis" : "Choisir ce pack"}
                                                        </button>
                                                    </div>

                                                    {/* Decorative elements */}
                                                    <div className="absolute top-4 right-4 opacity-10">
                                                        <IconComponent className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                </div>
                                            </motion.div>

                                    );
                                })}
                            </div>

                            <div className="text-center mt-16">
                                <p className="text-gray-600 mb-4">
                                    Besoin d'aide pour choisir le pack qui vous convient ?
                                </p>
                                <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                                    Contactez nos experts
                                </button>
                            </div>
                        </div>
                    </div>
                </AnimateOnScroll>
            </section>
        </>
    )
}


