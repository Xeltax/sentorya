"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Calendar } from "lucide-react";
import { useGoPhish } from "@/hooks/useGoPhish";
import { CreateCampaignRequest } from "@/types/Campaign";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateCampaignDialogProps {
    isOpen: boolean;
    toggle: () => void;
    organizations: Array<{ id: string; name: string }>;
    onCampaignCreated: (campaign: any) => void;
}

export default function CreateCampaignDialog({
                                                 isOpen,
                                                 toggle,
                                                 organizations,
                                                 onCampaignCreated
                                             }: CreateCampaignDialogProps) {
    const {
        templates,
        pages,
        smtpProfiles,
        loadTemplates,
        loadPages,
        loadSMTPProfiles
    } = useGoPhish();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateCampaignRequest>({
        name: "",
        campaignId: "",
        organizationId: "",
        createInGoPhish: false,
        templateName: "",
        pageName: "",
        smtpProfileName: "",
        phishingUrl: "",
        launchDate: ""
    });

    // Charger les ressources GoPhish au montage
    useEffect(() => {
        if (isOpen) {
            loadTemplates();
            loadPages();
            loadSMTPProfiles();
            formData.createInGoPhish = true;
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.campaignId || !formData.organizationId) {
            alert("Veuillez remplir tous les champs obligatoires");
            return;
        }

        if (formData.createInGoPhish) {
            if (!formData.smtpProfileName || !formData.phishingUrl) {
                alert("Le profil SMTP et l'URL de phishing sont requis pour créer une campagne GoPhish");
                return;
            }
        }

        setLoading(true);
        onCampaignCreated(formData);
    };

    const handleChange = (field: keyof CreateCampaignRequest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={toggle}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Créer une nouvelle campagne</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations de base */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Informations générales</h3>

                        <div>
                            <Label htmlFor="name">Nom de la campagne *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="Campagne Q1 2024"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="campaignId">ID de la campagne *</Label>
                            <Input
                                id="campaignId"
                                value={formData.campaignId}
                                onChange={(e) => handleChange("campaignId", e.target.value)}
                                placeholder="q1-2024"
                                required
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                Identifiant unique (lettres, chiffres, tirets)
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="organizationId">Organisation *</Label>
                            <Select
                                value={formData.organizationId}
                                onValueChange={(value) => handleChange("organizationId", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une organisation" />
                                </SelectTrigger>
                                <SelectContent>
                                    {organizations.map((org) => (
                                        <SelectItem key={org.id} value={org.id}>
                                            {org.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Option GoPhish */}
                    <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="createInGoPhish" className="text-lg font-semibold">
                                    Créer dans GoPhish
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Lancer automatiquement la campagne dans GoPhish
                                </p>
                            </div>
                            <Switch
                                id="createInGoPhish"
                                checked={formData.createInGoPhish}
                                onCheckedChange={(checked : boolean) => handleChange("createInGoPhish", checked)}
                            />
                        </div>

                        {formData.createInGoPhish && (
                            <Alert>
                                <AlertDescription>
                                    La campagne sera automatiquement créée dans GoPhish avec un groupe contenant tous les membres de l&apos;organisation sélectionnée.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Configuration GoPhish */}
                    {formData.createInGoPhish && (
                        <Tabs defaultValue="required" className="w-full">

                            <div>
                                <Label htmlFor="smtpProfileName">Profil SMTP *</Label>
                                <Select
                                    value={formData.smtpProfileName}
                                    onValueChange={(value) => handleChange("smtpProfileName", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un profil SMTP" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {smtpProfiles.length === 0 ? (
                                            <SelectItem value="none" disabled>
                                                Aucun profil SMTP disponible
                                            </SelectItem>
                                        ) : (
                                            smtpProfiles.map((smtp) => (
                                                <SelectItem key={smtp.id} value={smtp.name}>
                                                    {smtp.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                {smtpProfiles.length === 0 && (
                                    <p className="text-sm text-red-500 mt-1">
                                        Veuillez créer un profil SMTP dans GoPhish
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="phishingUrl">URL de phishing *</Label>
                                <Input
                                    id="phishingUrl"
                                    type="url"
                                    value={formData.phishingUrl}
                                    onChange={(e) => handleChange("phishingUrl", e.target.value)}
                                    placeholder="https://phishing.example.com"
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                    URL où les cibles seront redirigées
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="templateName">Template d&apos;email</Label>
                                <Select
                                    value={formData.templateName}
                                    onValueChange={(value) => handleChange("templateName", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Template par défaut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templates.map((template) => (
                                            <SelectItem key={template.id} value={template.name}>
                                                {template.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="pageName">Landing page</Label>
                                <Select
                                    value={formData.pageName}
                                    onValueChange={(value) => handleChange("pageName", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Page par défaut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pages.map((page) => (
                                            <SelectItem key={page.id} value={page.name}>
                                                {page.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="launchDate">Date de lancement</Label>
                                <Input
                                    id="launchDate"
                                    type="datetime-local"
                                    value={formData.launchDate}
                                    onChange={(e) => handleChange("launchDate", e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                    Laisser vide pour un lancement immédiat
                                </p>
                            </div>
                        </Tabs>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={toggle}
                            disabled={loading}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {formData.createInGoPhish ? "Créer et lancer" : "Créer"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}