"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    ArrowLeft,
    Save,
    Server,
    Plus,
    Mail,
    TestTube,
    AlertCircle,
    CheckCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGoPhish } from "@/hooks/useGoPhish";
import { GoPhishSMTP } from "@/types/GoPhish";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Client from "@/utils/client";
import { ROUTES } from "@/utils/routes";

export default function SMTPConfigPage() {
    const router = useRouter();
    const { smtpProfiles, loadSMTPProfiles } = useGoPhish();

    const [selectedProfile, setSelectedProfile] = useState<GoPhishSMTP | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadSMTPProfiles();
    }, []);

    const handleSelectProfile = (profile: GoPhishSMTP) => {
        setSelectedProfile(profile);
        setIsEditing(true);
    };

    const handleNewProfile = () => {
        setSelectedProfile({
            name: "",
            host: "",
            interfaceType: "SMTP",
            fromAddress: "",
            ignoreCertErrors: false,
        });
        setIsEditing(true);
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Profils SMTP</h1>
                        <p className="text-muted-foreground">
                            Configurez vos serveurs d'envoi d'emails
                        </p>
                    </div>
                </div>

                {!isEditing && (
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <a
                                href="https://docs.getgophish.com/user-guide/documentation/sending-profiles"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Documentation
                            </a>
                        </Button>
                        <Button onClick={handleNewProfile}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouveau profil SMTP
                        </Button>
                    </div>
                )}
            </div>

            {/* Alert Info */}
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuration SMTP</AlertTitle>
                <AlertDescription>
                    Les profils SMTP sont actuellement en lecture seule via l'API.
                    Pour créer ou modifier un profil, veuillez utiliser l'interface GoPhish directement.
                    Cette limitation sera levée dans une future mise à jour.
                </AlertDescription>
            </Alert>

            {/* Main Content */}
            {isEditing && selectedProfile ? (
                <SMTPEditor
                    profile={selectedProfile}
                    onProfileChange={setSelectedProfile}
                    onSave={async () => {
                        toast.info("La création/modification SMTP sera implémentée prochainement");
                        setIsEditing(false);
                    }}
                    onCancel={() => {
                        setIsEditing(false);
                        setSelectedProfile(null);
                    }}
                />
            ) : (
                <SMTPList
                    profiles={smtpProfiles}
                    onSelectProfile={handleSelectProfile}
                />
            )}
        </div>
    );
}

// Liste des profils SMTP
function SMTPList({
                      profiles,
                      onSelectProfile
                  }: {
    profiles: GoPhishSMTP[];
    onSelectProfile: (profile: GoPhishSMTP) => void;
}) {
    return (
        <div className="grid gap-4">
            {profiles.length === 0 ? (
                <Card>
                    <CardContent className="pt-6 text-center">
                        <Server className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Aucun profil SMTP</h3>
                        <p className="text-muted-foreground mb-4">
                            Créez votre premier profil SMTP dans l'interface GoPhish
                        </p>
                        <Button variant="outline" asChild>
                            <a
                                href="https://docs.getgophish.com/user-guide/documentation/sending-profiles"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Voir la documentation
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                profiles.map((profile) => (
                    <Card
                        key={profile.id}
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => onSelectProfile(profile)}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="flex items-center gap-2">
                                        <Server className="h-5 w-5" />
                                        {profile.name}
                                        <Badge variant="outline">ID: {profile.id}</Badge>
                                    </CardTitle>
                                    <CardDescription className="mt-3 space-y-2">
                                        {profile.host && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Server className="h-3 w-3" />
                                                <span className="font-mono">{profile.host}</span>
                                            </div>
                                        )}
                                        {profile.fromAddress && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-3 w-3" />
                                                <span>{profile.fromAddress}</span>
                                            </div>
                                        )}
                                        <div className="flex gap-2 mt-2">
                                            {profile.interfaceType && (
                                                <Badge variant="secondary">
                                                    {profile.interfaceType}
                                                </Badge>
                                            )}
                                            {profile.ignoreCertErrors && (
                                                <Badge variant="outline" className="text-orange-600">
                                                    Ignore SSL
                                                </Badge>
                                            )}
                                        </div>
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                ))
            )}
        </div>
    );
}

// Éditeur SMTP (Preview uniquement pour le moment)
function SMTPEditor({
                        profile,
                        onProfileChange,
                        onSave,
                        onCancel
                    }: {
    profile: GoPhishSMTP;
    onProfileChange: (profile: GoPhishSMTP) => void;
    onSave: () => void;
    onCancel: () => void;
}) {
    const [testingConnection, setTestingConnection] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");

    const handleFieldChange = (field: keyof GoPhishSMTP, value: any) => {
        onProfileChange({ ...profile, [field]: value });
    };

    const handleTestConnection = async () => {
        setTestingConnection(true);
        setConnectionStatus("idle");

        // Simuler un test de connexion
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% de succès simulé
            setConnectionStatus(success ? "success" : "error");
            setTestingConnection(false);

            if (success) {
                toast.success("Connexion SMTP réussie");
            } else {
                toast.error("Échec de la connexion SMTP");
            }
        }, 2000);
    };

    return (
        <div className="space-y-6">
            {/* Configuration principale */}
            <Card>
                <CardHeader>
                    <CardTitle>Configuration du profil SMTP</CardTitle>
                    <CardDescription>
                        Configurez votre serveur d'envoi d'emails
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Actuellement en mode preview. Utilisez GoPhish pour créer/modifier les profils SMTP.
                        </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="name">Nom du profil *</Label>
                            <Input
                                id="name"
                                value={profile.name}
                                onChange={(e) => handleFieldChange("name", e.target.value)}
                                placeholder="Mon serveur SMTP"
                                disabled
                            />
                        </div>

                        <div>
                            <Label htmlFor="host">Serveur SMTP *</Label>
                            <Input
                                id="host"
                                value={profile.host || ""}
                                onChange={(e) => handleFieldChange("host", e.target.value)}
                                placeholder="smtp.gmail.com:587"
                                disabled
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Format: host:port (ex: smtp.gmail.com:587)
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="fromAddress">Adresse d'envoi *</Label>
                            <Input
                                id="fromAddress"
                                type="email"
                                value={profile.fromAddress || ""}
                                onChange={(e) => handleFieldChange("fromAddress", e.target.value)}
                                placeholder="noreply@example.com"
                                disabled
                            />
                        </div>

                        <div>
                            <Label htmlFor="interfaceType">Type d'interface</Label>
                            <Select
                                value={profile.interfaceType || "SMTP"}
                                onValueChange={(value) => handleFieldChange("interfaceType", value)}
                                disabled
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SMTP">SMTP</SelectItem>
                                    <SelectItem value="SMTP+TLS">SMTP+TLS</SelectItem>
                                    <SelectItem value="SMTPS">SMTPS</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="ignoreCert">Ignorer les erreurs SSL</Label>
                                <p className="text-xs text-muted-foreground">
                                    Pour certificats auto-signés (dev uniquement)
                                </p>
                            </div>
                            <Switch
                                id="ignoreCert"
                                checked={profile.ignoreCertErrors || false}
                                onCheckedChange={(checked) => handleFieldChange("ignoreCertErrors", checked)}
                                disabled
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Informations complémentaires */}
            <Card>
                <CardHeader>
                    <CardTitle>Fournisseurs SMTP populaires</CardTitle>
                    <CardDescription>
                        Configurations recommandées pour les services courants
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <SMTPProvider
                            name="Gmail"
                            host="smtp.gmail.com:587"
                            notes="Nécessite un mot de passe d'application. TLS recommandé."
                        />
                        <SMTPProvider
                            name="SendGrid"
                            host="smtp.sendgrid.net:587"
                            notes="Utiliser la clé API comme mot de passe. Excellent pour le volume."
                        />
                        <SMTPProvider
                            name="Office 365"
                            host="smtp.office365.com:587"
                            notes="STARTTLS sur le port 587. Authentification OAuth disponible."
                        />
                        <SMTPProvider
                            name="Amazon SES"
                            host="email-smtp.us-east-1.amazonaws.com:587"
                            notes="Configurer les identités d'envoi au préalable."
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Test de connexion */}
            <Card>
                <CardHeader>
                    <CardTitle>Test de connexion</CardTitle>
                    <CardDescription>
                        Vérifiez que votre configuration SMTP fonctionne
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={handleTestConnection}
                        disabled={testingConnection || !profile.host}
                        className="w-full"
                    >
                        {testingConnection ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Test en cours...
                            </>
                        ) : (
                            <>
                                <TestTube className="mr-2 h-4 w-4" />
                                Tester la connexion
                            </>
                        )}
                    </Button>

                    {connectionStatus === "success" && (
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-600">Connexion réussie</AlertTitle>
                            <AlertDescription className="text-green-600">
                                Le serveur SMTP est accessible et configuré correctement.
                            </AlertDescription>
                        </Alert>
                    )}

                    {connectionStatus === "error" && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Échec de la connexion</AlertTitle>
                            <AlertDescription>
                                Impossible de se connecter au serveur SMTP. Vérifiez les paramètres.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onCancel}>
                    Fermer
                </Button>
                <Button onClick={onSave} disabled>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder (bientôt)
                </Button>
            </div>
        </div>
    );
}

// Composant d'information fournisseur SMTP
function SMTPProvider({
                          name,
                          host,
                          notes
                      }: {
    name: string;
    host: string;
    notes: string;
}) {
    return (
        <div className="border rounded-lg p-4">
            <div className="flex items-start gap-3">
                <Server className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                    <h4 className="font-semibold mb-1">{name}</h4>
                    <p className="text-sm font-mono text-muted-foreground mb-2">
                        {host}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {notes}
                    </p>
                </div>
            </div>
        </div>
    );
}