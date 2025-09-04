import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export const Contact = () => {
    const contactInfo = [
        {
            icon: Mail,
            title: "Écrivez-nous",
            info: "security@sentorya.com",
            action: "mailto:security@sentorya.com"
        },
        {
            icon: Phone,
            title: "Appelez-nous",
            info: "+1 (555) 123-4567",
            action: "tel:+15551234567"
        },
        {
            icon: MapPin,
            title: "Rendez-nous visite",
            info: "123 Security Blvd, Cyber City, CC 12345",
            action: "#"
        }
    ];

    return (
        <section id="contact" className="py-20 bg-gradient-to-b from-[hsl(var(--cyber-light))] to-background">
            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Prêt à être
                        <span className="bg-gradient-to-r from-[hsl(var(--cyber-blue))] to-[hsl(var(--cyber-dark))] bg-clip-text text-transparent">
              {" "}protégé ?
            </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Lancez dès aujourd’hui votre audit de sécurité gratuit et découvrez comment
                        nous pouvons protéger votre organisation contre le phishing.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="shadow-[var(--shadow-card)]">
                            <CardHeader>
                                <CardTitle className="text-2xl">Demandez votre audit gratuit</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Prénom</label>
                                            <Input placeholder="Jean" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Nom</label>
                                            <Input placeholder="Dupont" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Adresse email</label>
                                        <Input type="email" placeholder="jean@entreprise.com" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Entreprise</label>
                                        <Input placeholder="Nom de votre entreprise" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Message</label>
                                        <Textarea
                                            placeholder="Parlez-nous de vos besoins en cybersécurité..."
                                            className="min-h-[120px]"
                                        />
                                    </div>
                                    <Button variant="hero" size="lg" className="w-full group">
                                        Commencer l’audit gratuit
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Contactez-nous</h3>
                            <p className="text-muted-foreground mb-8">
                                Nos experts en cybersécurité sont prêts à vous aider à évaluer
                                votre posture actuelle et à mettre en place la meilleure protection
                                pour votre organisation.
                            </p>
                        </div>

                        {contactInfo.map((contact, index) => (
                            <motion.a
                                key={contact.title}
                                href={contact.action}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/20 hover:bg-[hsl(var(--cyber-light))]/50 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--cyber-blue))] to-[hsl(var(--cyber-dark))] flex items-center justify-center">
                                    <contact.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="font-semibold group-hover:text-primary transition-colors">
                                        {contact.title}
                                    </div>
                                    <div className="text-muted-foreground">{contact.info}</div>
                                </div>
                            </motion.a>
                        ))}

                        <div className="p-6 rounded-lg bg-gradient-to-r from-[hsl(var(--cyber-blue))]/10 to-[hsl(var(--cyber-dark))]/10 border border-primary/20">
                            <h4 className="font-semibold mb-2">Pourquoi choisir Sentorya ?</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                    Taux de détection du phishing de 99,9 % (leader du marché)
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                    Surveillance continue 24/7 et réponse instantanée aux menaces
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                    Plus de 500 organisations protégées dans le monde
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                    Une équipe d’experts avec des décennies d’expérience
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
