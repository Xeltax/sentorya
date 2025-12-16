"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    ArrowLeft,
    Save,
    Eye,
    Code,
    Upload,
    Globe,
    Plus,
    FileText,
    Sparkles,
    ExternalLink
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGoPhish } from "@/hooks/useGoPhish";
import { GoPhishPage } from "@/types/GoPhish";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PagesManagementPage() {
    const router = useRouter();
    const { pages, loadPages, createPage } = useGoPhish();

    const [selectedPage, setSelectedPage] = useState<GoPhishPage | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);

    useEffect(() => {
        loadPages();
    }, []);

    const handleSelectPage = (page: GoPhishPage) => {
        setSelectedPage(page);
        setIsEditing(true);
    };

    const handleNewPage = () => {
        setSelectedPage({
            name: "",
            html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 400px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .logo h1 {
            color: #667eea;
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
        }
        
        input[type="text"],
        input[type="email"],
        input[type="password"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 5px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        
        input[type="text"]:focus,
        input[type="email"]:focus,
        input[type="password"]:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .submit-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
        }
        
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>🔐 Connexion</h1>
            <p style="color: #666;">Veuillez vous connecter pour continuer</p>
        </div>
        
        <form method="POST">
            <div class="form-group">
                <label for="username">Nom d'utilisateur ou Email</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
                <label for="password">Mot de passe</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="submit-btn">Se connecter</button>
        </form>
        
        <div class="footer">
            <p>Connexion sécurisée</p>
        </div>
    </div>
</body>
</html>`,
            captureCredentials: true,
            capturePasswords: true,
            redirectUrl: "",
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!selectedPage) return;

        try {
            if (selectedPage.id) {
                toast.info("Mise à jour non encore implémentée");
            } else {
                await createPage({
                    name: selectedPage.name,
                    html: selectedPage.html,
                    captureCredentials: selectedPage.captureCredentials,
                    capturePasswords: selectedPage.capturePasswords,
                    redirectUrl: selectedPage.redirectUrl,
                });
                toast.success("Landing page créée avec succès");
                await loadPages();
                setIsEditing(false);
                setSelectedPage(null);
            }
        } catch (error) {
            console.error(error);
        }
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
                        <h1 className="text-3xl font-bold">Landing Pages</h1>
                        <p className="text-muted-foreground">
                            Créez et gérez vos pages de phishing
                        </p>
                    </div>
                </div>

                {!isEditing && (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowImportDialog(true)}>
                            <Upload className="mr-2 h-4 w-4" />
                            Importer
                        </Button>
                        <Button onClick={handleNewPage}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouvelle page
                        </Button>
                    </div>
                )}
            </div>

            {/* Main Content */}
            {isEditing && selectedPage ? (
                <PageEditor
                    page={selectedPage}
                    onPageChange={setSelectedPage}
                    onSave={handleSave}
                    onCancel={() => {
                        setIsEditing(false);
                        setSelectedPage(null);
                    }}
                />
            ) : (
                <PagesList
                    pages={pages}
                    onSelectPage={handleSelectPage}
                />
            )}

            {/* Import Dialog */}
            <ImportPageDialog
                open={showImportDialog}
                onClose={() => setShowImportDialog(false)}
                onImport={(page) => {
                    setSelectedPage(page);
                    setIsEditing(true);
                    setShowImportDialog(false);
                }}
            />
        </div>
    );
}

// Liste des pages
function PagesList({
                       pages,
                       onSelectPage
                   }: {
    pages: GoPhishPage[];
    onSelectPage: (page: GoPhishPage) => void;
}) {
    return (
        <div className="grid gap-4">
            {pages.length === 0 ? (
                <Card>
                    <CardContent className="pt-6 text-center">
                        <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Aucune landing page</h3>
                        <p className="text-muted-foreground mb-4">
                            Créez votre première landing page de phishing
                        </p>
                    </CardContent>
                </Card>
            ) : (
                pages.map((page) => (
                    <Card
                        key={page.id}
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => onSelectPage(page)}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="flex items-center gap-2">
                                        {page.name}
                                        <Badge variant="outline">ID: {page.id}</Badge>
                                    </CardTitle>
                                    <CardDescription className="mt-2 space-y-1">
                                        <div className="flex gap-2 flex-wrap">
                                            {page.captureCredentials && (
                                                <Badge variant="secondary">
                                                    Capture identifiants
                                                </Badge>
                                            )}
                                            {page.capturePasswords && (
                                                <Badge variant="secondary">
                                                    Capture mots de passe
                                                </Badge>
                                            )}
                                        </div>
                                        {page.redirectUrl && (
                                            <div className="text-xs mt-2 flex items-center gap-1">
                                                <ExternalLink className="h-3 w-3" />
                                                Redirige vers: {page.redirectUrl}
                                            </div>
                                        )}
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectPage(page);
                                    }}
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                ))
            )}
        </div>
    );
}

// Éditeur de page
function PageEditor({
                        page,
                        onPageChange,
                        onSave,
                        onCancel
                    }: {
    page: GoPhishPage;
    onPageChange: (page: GoPhishPage) => void;
    onSave: () => void;
    onCancel: () => void;
}) {
    const [viewMode, setViewMode] = useState<"split" | "code" | "preview">("split");

    const handleFieldChange = (field: keyof GoPhishPage, value: any) => {
        onPageChange({ ...page, [field]: value });
    };

    const formatHTML = () => {
        try {
            const formatted = page.html
                .replace(/></g, ">\n<")
                .replace(/\n\s*\n/g, "\n");
            handleFieldChange("html", formatted);
            toast.success("HTML formaté");
        } catch (error) {
            toast.error("Erreur de formatage");
        }
    };

    return (
        <div className="space-y-4">
            {/* Configuration */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <Label htmlFor="name">Nom de la page *</Label>
                            <Input
                                id="name"
                                value={page.name}
                                onChange={(e) => handleFieldChange("name", e.target.value)}
                                placeholder="Ma Landing Page"
                            />
                        </div>
                        <div>
                            <Label htmlFor="redirectUrl">URL de redirection</Label>
                            <Input
                                id="redirectUrl"
                                value={page.redirectUrl}
                                onChange={(e) => handleFieldChange("redirectUrl", e.target.value)}
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="captureCredentials">Capturer les identifiants</Label>
                                <p className="text-xs text-muted-foreground">
                                    Enregistrer les données de formulaire
                                </p>
                            </div>
                            <Switch
                                id="captureCredentials"
                                checked={page.captureCredentials}
                                onCheckedChange={(checked) => handleFieldChange("captureCredentials", checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="capturePasswords">Capturer les mots de passe</Label>
                                <p className="text-xs text-muted-foreground">
                                    Inclure les champs password
                                </p>
                            </div>
                            <Switch
                                id="capturePasswords"
                                checked={page.capturePasswords}
                                onCheckedChange={(checked) => handleFieldChange("capturePasswords", checked)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={formatHTML}
                            >
                                <Sparkles className="mr-2 h-4 w-4" />
                                Formater HTML
                            </Button>
                        </div>

                        <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
                            <TabsList>
                                <TabsTrigger value="split">
                                    <Code className="mr-2 h-4 w-4" />
                                    Split
                                </TabsTrigger>
                                <TabsTrigger value="code">Code</TabsTrigger>
                                <TabsTrigger value="preview">Preview</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onCancel}>
                                Annuler
                            </Button>
                            <Button onClick={onSave}>
                                <Save className="mr-2 h-4 w-4" />
                                Sauvegarder
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Editor/Preview */}
            <div className="grid grid-cols-1 gap-4" style={{
                gridTemplateColumns: viewMode === "split" ? "1fr 1fr" : "1fr"
            }}>
                {/* Code Editor */}
                {(viewMode === "split" || viewMode === "code") && (
                    <Card className="h-[700px]">
                        <CardHeader>
                            <CardTitle className="text-lg">Éditeur HTML</CardTitle>
                            <CardDescription>
                                Créez votre landing page personnalisée
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[calc(100%-100px)]">
                            <Textarea
                                value={page.html}
                                onChange={(e) => handleFieldChange("html", e.target.value)}
                                className="h-full font-mono text-sm resize-none"
                                placeholder="<html>...</html>"
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Preview */}
                {(viewMode === "split" || viewMode === "preview") && (
                    <Card className="h-[700px]">
                        <CardHeader>
                            <CardTitle className="text-lg">Aperçu Live</CardTitle>
                            <CardDescription>
                                Prévisualisation de votre page
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[calc(100%-100px)]">
                            <Alert className="mb-4">
                                <AlertDescription>
                                    Les données soumises seront capturées par GoPhish
                                </AlertDescription>
                            </Alert>
                            <iframe
                                srcDoc={page.html}
                                className="w-full h-full border rounded bg-white"
                                sandbox="allow-same-origin allow-forms"
                                title="Preview"
                            />
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

// Dialog d'import
function ImportPageDialog({
                              open,
                              onClose,
                              onImport
                          }: {
    open: boolean;
    onClose: () => void;
    onImport: (page: GoPhishPage) => void;
}) {
    const [importData, setImportData] = useState<Partial<GoPhishPage>>({
        name: "",
        html: "",
        captureCredentials: true,
        capturePasswords: true,
        redirectUrl: "",
    });
    const [importUrl, setImportUrl] = useState("");

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setImportData(prev => ({ ...prev, html: content }));
            toast.success("Fichier chargé");
        };
        reader.readAsText(file);
    };

    const handleImportFromUrl = async () => {
        if (!importUrl) {
            toast.error("Veuillez entrer une URL");
            return;
        }

        toast.info("Import depuis URL - Fonctionnalité à venir");
        // Ici vous pourrez ajouter un endpoint backend pour fetcher l'URL
    };

    const handleImport = () => {
        if (!importData.name || !importData.html) {
            toast.error("Nom et HTML requis");
            return;
        }

        onImport(importData as GoPhishPage);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Importer une landing page</DialogTitle>
                    <DialogDescription>
                        Importez une page HTML existante ou depuis une URL
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="file" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="file">Fichier</TabsTrigger>
                        <TabsTrigger value="url">URL (bientôt)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="file" className="space-y-4">
                        <div>
                            <Label htmlFor="import-name">Nom de la page</Label>
                            <Input
                                id="import-name"
                                value={importData.name}
                                onChange={(e) => setImportData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Ma page importée"
                            />
                        </div>

                        <div>
                            <Label htmlFor="import-file">Fichier HTML</Label>
                            <Input
                                id="import-file"
                                type="file"
                                accept=".html,.htm"
                                onChange={handleFileUpload}
                            />
                        </div>

                        <div>
                            <Label htmlFor="import-html">Ou collez le HTML</Label>
                            <Textarea
                                id="import-html"
                                value={importData.html}
                                onChange={(e) => setImportData(prev => ({ ...prev, html: e.target.value }))}
                                rows={10}
                                className="font-mono text-sm"
                                placeholder="<html>...</html>"
                            />
                        </div>

                        <div>
                            <Label htmlFor="redirect">URL de redirection (optionnel)</Label>
                            <Input
                                id="redirect"
                                value={importData.redirectUrl}
                                onChange={(e) => setImportData(prev => ({ ...prev, redirectUrl: e.target.value }))}
                                placeholder="https://example.com"
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="url" className="space-y-4">
                        <Alert>
                            <AlertDescription>
                                Cette fonctionnalité permettra d&apos;importer automatiquement le HTML d&apos;une URL.
                                À implémenter côté backend.
                            </AlertDescription>
                        </Alert>

                        <div>
                            <Label htmlFor="url-input">URL à importer</Label>
                            <Input
                                id="url-input"
                                value={importUrl}
                                onChange={(e) => setImportUrl(e.target.value)}
                                placeholder="https://example.com/login"
                            />
                        </div>

                        <Button onClick={handleImportFromUrl} disabled>
                            <Globe className="mr-2 h-4 w-4" />
                            Importer depuis l&apos;URL
                        </Button>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button onClick={handleImport}>
                        <Upload className="mr-2 h-4 w-4" />
                        Importer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}