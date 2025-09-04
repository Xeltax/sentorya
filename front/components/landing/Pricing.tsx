import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Crown } from "lucide-react";

export const Pricing = () => {
    const plans = [
        {
            icon: Shield,
            title: "Essentiel",
            price: "99€ / mois",
            description: "La protection de base idéale pour les petites structures souhaitant se prémunir du phishing.",
            features: [
                "Analyse en temps réel",
                "Taux de détection 99,9 %",
                "Alertes instantanées",
            ],
            cta: "Commencer"
        },
        {
            icon: Zap,
            title: "Professionnel",
            price: "249€ / mois",
            description: "Une couverture avancée incluant des audits réguliers et des simulations de phishing.",
            features: [
                "Tout le pack Essentiel",
                "Audit de sécurité trimestriel",
                "Simulations d’attaques",
                "Formation des employés"
            ],
            cta: "Choisir ce plan",
            highlight: true
        },
        {
            icon: Crown,
            title: "Entreprise",
            price: "Sur devis",
            description: "Une solution complète et personnalisée adaptée aux grandes organisations.",
            features: [
                "Tout le pack Professionnel",
                "Audit mensuel complet",
                "Support prioritaire 24/7",
                "Programme de certification avancé"
            ],
            cta: "Nous contacter"
        }
    ];

    return (
        <section id="pricing" className="py-20 bg-gradient-to-b from-background to-[hsl(var(--cyber-light))]">
            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Nos offres de
                        <span className="bg-gradient-to-r from-[hsl(var(--cyber-blue))] to-[hsl(var(--cyber-dark))] bg-clip-text text-transparent">
              {" "}protection
            </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Des solutions adaptées à chaque organisation, de la start-up aux grandes entreprises,
                        pour une protection optimale contre le phishing.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <Card className={`h-full relative hover:shadow-[var(--shadow-cyber)] hover:-translate-y-1.5 transition-all duration-300 ${plan.highlight ? "border-primary shadow-[var(--shadow-cyber)]" : "border-border/50"}`}>
                                {plan.highlight && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                        Populaire
                                    </div>
                                )}
                                <CardHeader className="text-center">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--cyber-blue))] to-[hsl(var(--cyber-dark))] flex items-center justify-center mx-auto mb-4">
                                        <plan.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl">{plan.title}</CardTitle>
                                    <div className="text-3xl font-bold text-primary mt-2">{plan.price}</div>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center text-center">
                                    <p className="text-muted-foreground mb-6">{plan.description}</p>
                                    <ul className="space-y-2 text-sm text-muted-foreground mb-6 text-left w-full">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button variant={plan.highlight ? "hero" : "outline-hero"} size="lg" className="w-full">
                                        {plan.cta}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
