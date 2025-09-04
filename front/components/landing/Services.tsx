import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Search, Users, AlertTriangle, Eye, Lock } from "lucide-react";

export const Services = () => {
    const services = [
        {
            icon: Shield,
            title: "Protection contre le phishing",
            description: "Un système avancé, basé sur l’IA, qui détecte et bloque les tentatives de phishing les plus sophistiquées en temps réel.",
            features: ["Analyse en temps réel", "Taux de détection de 99,9 %", "Protection contre les menaces inédites"]
        },
        {
            icon: Search,
            title: "Audit de sécurité",
            description: "Des évaluations complètes pour identifier les vulnérabilités et renforcer la posture de sécurité de votre organisation.",
            features: ["Analyse des failles", "Rapports de conformité", "Recommandations d’experts"]
        },
        {
            icon: Users,
            title: "Formation des employés",
            description: "Des programmes interactifs de sensibilisation à la cybersécurité pour préparer vos équipes face aux menaces de phishing.",
            features: ["Simulations d’attaques", "Suivi des progrès", "Programmes certifiants"]
        }
    ];

    const stats = [
        { icon: Eye, value: "500+", label: "Entreprises protégées" },
        { icon: AlertTriangle, value: "50K+", label: "Menaces bloquées" },
        { icon: Lock, value: "99,9%", label: "Taux de détection" },
        { icon: Shield, value: "24/7", label: "Surveillance continue" }
    ];

    return (
        <section id="services" className="py-20 bg-gradient-to-b from-background to-[hsl(var(--cyber-light))]">
            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Suite complète de
                        <span className="bg-gradient-to-r from-[hsl(var(--cyber-blue))] to-[hsl(var(--cyber-dark))] bg-clip-text text-transparent">
              {" "}protection anti-phishing
            </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Des solutions de cybersécurité globales, conçues pour protéger votre organisation
                        contre les attaques de phishing et les menaces les plus avancées.
                    </p>
                </motion.div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <Card className="h-full hover:shadow-[var(--shadow-cyber)] transition-all duration-300 border-border/50 hover:border-primary/20">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--cyber-blue))] to-[hsl(var(--cyber-dark))] flex items-center justify-center mb-4">
                                        <service.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-6">{service.description}</p>
                                    <ul className="space-y-2">
                                        {service.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--cyber-blue))] to-[hsl(var(--cyber-dark))] flex items-center justify-center mx-auto mb-4">
                                <stat.icon className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
