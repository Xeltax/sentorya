import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Eye, AlertTriangle } from "lucide-react";
import heroImage from "@/public/hero-cyber.jpg";
import Image from "next/image";

export const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background with gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-[hsl(var(--cyber-light))] to-background">
                <div className="absolute inset-0 opacity-30"
                     style={{
                         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E5F3FF' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                     }}
                ></div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10 pt-16">
                {/* Left Content */}
                <div className="text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 bg-[hsl(var(--cyber-light))] text-[hsl(var(--cyber-dark))] px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Shield className="w-4 h-4" />
                            Plus de 500 entreprises nous font confiance
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
                    >
                        Le phishing stoppé net,
                        <span className="bg-gradient-to-r from-[hsl(var(--cyber-blue))] to-[hsl(var(--cyber-dark))] bg-clip-text text-transparent">
              {" "}avant même le premier clic
            </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
                    >
                        Protégez votre organisation contre les attaques de phishing les plus sophistiquées grâce à notre
                        plateforme avancée de détection et de prévention. Surveillance en temps réel,
                        audits d’experts et formations complètes en cybersécurité.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    >
                        <Button variant="hero" size="xl" className="group">
                            Lancer un audit gratuit
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <Button variant="outline-hero" size="xl">
                            Voir la démo
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex items-center justify-center lg:justify-start gap-8 mt-12 text-sm text-muted-foreground"
                    >
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-primary" />
                            <span>Surveillance 24/7</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary" />
                            <span>Taux de détection 99,9%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-primary" />
                            <span>Alertes en temps réel</span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Content - Hero Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className="relative"
                >
                    <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-cyber)]">
                        <Image
                            src={heroImage}
                            alt="Protection cybersécurité"
                            className="w-full h-auto"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--cyber-dark))]/20 to-transparent"></div>
                    </div>

                    {/* Floating elements */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="absolute -top-4 -right-4 bg-background rounded-lg shadow-[var(--shadow-card)] p-4 border border-border"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium">Protégé</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                        className="absolute -bottom-4 -left-4 bg-background rounded-lg shadow-[var(--shadow-card)] p-4 border border-border"
                    >
                        <div className="text-sm">
                            <div className="font-semibold text-primary">2 847</div>
                            <div className="text-muted-foreground">Menaces bloquées</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
