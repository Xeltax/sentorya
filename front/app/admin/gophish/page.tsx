"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGoPhish } from "@/hooks/useGoPhish";
import { Plus, Mail, Globe, Server, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function GoPhishResourcesPage() {
    const {
        templates,
        pages,
        smtpProfiles,
        groups,
        loading,
        loadTemplates,
        loadPages,
        loadSMTPProfiles,
        loadGroups,
        createTemplate,
        createPage,
    } = useGoPhish();

    const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
    const [openPageDialog, setOpenPageDialog] = useState(false);

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = () => {
        loadTemplates();
        loadPages();
        loadSMTPProfiles();
        loadGroups();
    };

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Ressources GoPhish</h1>
                    <p className="text-muted-foreground mt-2">
                        Gérez vos templates, landing pages et profils SMTP
                    </p>
                </div>
                <Button variant="outline" onClick={loadAll} disabled={loading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser
                </Button>
            </div>

            <Tabs defaultValue="templates" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="templates">
                        <Mail className="mr-2 h-4 w-4" />
                        Templates
                    </TabsTrigger>
                    <TabsTrigger value="pages">
                        <Globe className="mr-2 h-4 w-4" />
                        Landing Pages
                    </TabsTrigger>
                    <TabsTrigger value="smtp">
                        <Server className="mr-2 h-4 w-4" />
                        SMTP
                    </TabsTrigger>
                    <TabsTrigger value="groups">
                        Groupes
                    </TabsTrigger>
                </TabsList>

                {/* Templates */}
                <TabsContent value="templates" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            {templates.length} template(s) disponible(s)
                        </p>
                        <Dialog open={openTemplateDialog} onOpenChange={setOpenTemplateDialog}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nouveau template
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Créer un template d&apos;email</DialogTitle>
                                </DialogHeader>
                                <TemplateForm
                                    onSubmit={async (data) => {
                                        await createTemplate(data);
                                        setOpenTemplateDialog(false);
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-4">
                        {templates.map((template) => (
                            <Card key={template.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{template.name}</CardTitle>
                                            {template.subject && (
                                                <CardDescription className="mt-2">
                                                    Sujet: {template.subject}
                                                </CardDescription>
                                            )}
                                        </div>
                                        <Badge variant="outline">
                                            ID: {template.id}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                {template.html && (
                                    <CardContent>
                                        <details className="cursor-pointer">
                                            <summary className="text-sm font-medium">Voir le HTML</summary>
                                            <pre className="mt-2 text-xs bg-secondary p-4 rounded overflow-auto max-h-40">
                                                {template.html.substring(0, 500)}...
                                            </pre>
                                        </details>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Pages */}
                <TabsContent value="pages" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            {pages.length} page(s) disponible(s)
                        </p>
                        <Dialog open={openPageDialog} onOpenChange={setOpenPageDialog}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nouvelle page
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Créer une landing page</DialogTitle>
                                </DialogHeader>
                                <PageForm
                                    onSubmit={async (data) => {
                                        await createPage(data);
                                        setOpenPageDialog(false);
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-4">
                        {pages.map((page) => (
                            <Card key={page.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{page.name}</CardTitle>
                                            <CardDescription className="mt-2 space-y-1">
                                                {page.captureCredentials && (
                                                    <Badge variant="secondary" className="mr-2">
                                                        Capture identifiants
                                                    </Badge>
                                                )}
                                                {page.redirectUrl && (
                                                    <div className="text-xs mt-2">
                                                        Redirection: {page.redirectUrl}
                                                    </div>
                                                )}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline">
                                            ID: {page.id}
                                        </Badge>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* SMTP */}
                <TabsContent value="smtp" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            {smtpProfiles.length} profil(s) SMTP disponible(s)
                        </p>
                        <Button size="sm" variant="outline" asChild>
                            <a href="https://docs.getgophish.com/user-guide/documentation/sending-profiles" target="_blank">
                                Créer dans GoPhish
                            </a>
                        </Button>
                    </div>

                    {smtpProfiles.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-center text-muted-foreground">
                                    Aucun profil SMTP configuré. Créez-en un dans l&apos;interface GoPhish.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {smtpProfiles.map((smtp) => (
                                <Card key={smtp.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{smtp.name}</CardTitle>
                                                <CardDescription className="mt-2 space-y-1">
                                                    {smtp.host && <div>Hôte: {smtp.host}</div>}
                                                    {smtp.fromAddress && <div>De: {smtp.fromAddress}</div>}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="outline">
                                                ID: {smtp.id}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Groupes */}
                <TabsContent value="groups" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        {groups.length} groupe(s) disponible(s)
                    </p>

                    <div className="grid gap-4">
                        {groups.map((group) => (
                            <Card key={group.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{group.name}</CardTitle>
                                            <CardDescription className="mt-2">
                                                {group.targets.length} cible(s)
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline">
                                            ID: {group.id}
                                        </Badge>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Formulaire de création de template
function TemplateForm({ onSubmit }: { onSubmit: (data: any) => Promise<void> }) {
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        html: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Nom du template *</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                />
            </div>

            <div>
                <Label htmlFor="subject">Sujet de l&apos;email *</Label>
                <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    required
                />
            </div>

            <div>
                <Label htmlFor="html">Contenu HTML *</Label>
                <Textarea
                    id="html"
                    value={formData.html}
                    onChange={(e) => setFormData(prev => ({ ...prev, html: e.target.value }))}
                    rows={10}
                    className="font-mono text-sm"
                    placeholder="<html>...</html>"
                    required
                />
                <p className="text-xs text-muted-foreground mt-1">
                    Utilisez {`{{.FirstName}}`}, {`{{.LastName}}`}, {`{{.URL}}`} pour personnaliser
                </p>
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Création..." : "Créer le template"}
            </Button>
        </form>
    );
}

// Formulaire de création de page
function PageForm({ onSubmit }: { onSubmit: (data: any) => Promise<void> }) {
    const [formData, setFormData] = useState({
        name: "",
        html: "",
        captureCredentials: true,
        capturePasswords: true,
        redirectUrl: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Nom de la page *</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                />
            </div>

            <div>
                <Label htmlFor="html">Contenu HTML *</Label>
                <Textarea
                    id="html"
                    value={formData.html}
                    onChange={(e) => setFormData(prev => ({ ...prev, html: e.target.value }))}
                    rows={10}
                    className="font-mono text-sm"
                    placeholder="<!DOCTYPE html>..."
                    required
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="captureCredentials">Capturer les identifiants</Label>
                <Switch
                    id="captureCredentials"
                    checked={formData.captureCredentials}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, captureCredentials: checked }))}
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="capturePasswords">Capturer les mots de passe</Label>
                <Switch
                    id="capturePasswords"
                    checked={formData.capturePasswords}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, capturePasswords: checked }))}
                />
            </div>

            <div>
                <Label htmlFor="redirectUrl">URL de redirection</Label>
                <Input
                    id="redirectUrl"
                    type="url"
                    value={formData.redirectUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, redirectUrl: e.target.value }))}
                    placeholder="https://example.com"
                />
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Création..." : "Créer la page"}
            </Button>
        </form>
    );
}