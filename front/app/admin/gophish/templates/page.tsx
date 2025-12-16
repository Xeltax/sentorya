"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Save,
    Eye,
    Code,
    Upload,
    Download,
    Trash2,
    Plus,
    Copy,
    FileText,
    Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGoPhish } from "@/hooks/useGoPhish";
import { GoPhishTemplate } from "@/types/GoPhish";
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

export default function TemplatesPage() {
    const router = useRouter();
    const { templates, loadTemplates, createTemplate } = useGoPhish();

    const [selectedTemplate, setSelectedTemplate] = useState<GoPhishTemplate | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [showNewDialog, setShowNewDialog] = useState(false);

    useEffect(() => {
        loadTemplates();
    }, []);

    const handleSelectTemplate = (template: GoPhishTemplate) => {
        setSelectedTemplate(template);
        setIsEditing(true);
    };

    const handleNewTemplate = () => {
        setSelectedTemplate({
            name: "",
            subject: "",
            html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Bonjour {{.FirstName}} {{.LastName}}</h1>
    </div>
    <div class="content">
        <p>Votre message ici...</p>
        <p>
            <a href="{{.URL}}" class="button">Cliquez ici</a>
        </p>
        <p>Cordialement,<br>L'équipe</p>
    </div>
</body>
</html>`,
        });
        setIsEditing(true);
        setShowNewDialog(false);
    };

    const handleSave = async () => {
        if (!selectedTemplate) return;

        try {
            if (selectedTemplate.id) {
                // Update existing template
                toast.info("Mise à jour non encore implémentée");
            } else {
                // Create new template
                await createTemplate({
                    name: selectedTemplate.name,
                    subject: selectedTemplate.subject || "",
                    html: selectedTemplate.html || "",
                });
                toast.success("Template créé avec succès");
                await loadTemplates();
                setIsEditing(false);
                setSelectedTemplate(null);
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
                        <h1 className="text-3xl font-bold">Templates d&apos;Email</h1>
                        <p className="text-muted-foreground">
                            Créez et gérez vos templates de phishing
                        </p>
                    </div>
                </div>

                {!isEditing && (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowImportDialog(true)}>
                            <Upload className="mr-2 h-4 w-4" />
                            Importer
                        </Button>
                        <Button onClick={handleNewTemplate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouveau template
                        </Button>
                    </div>
                )}
            </div>

            {/* Main Content */}
            {isEditing && selectedTemplate ? (
                <TemplateEditor
                    template={selectedTemplate}
                    onTemplateChange={setSelectedTemplate}
                    onSave={handleSave}
                    onCancel={() => {
                        setIsEditing(false);
                        setSelectedTemplate(null);
                    }}
                />
            ) : (
                <TemplatesList
                    templates={templates}
                    onSelectTemplate={handleSelectTemplate}
                />
            )}

            {/* Import Dialog */}
            <ImportTemplateDialog
                open={showImportDialog}
                onClose={() => setShowImportDialog(false)}
                onImport={(template) => {
                    setSelectedTemplate(template);
                    setIsEditing(true);
                    setShowImportDialog(false);
                }}
            />
        </div>
    );
}

// Liste des templates
function TemplatesList({
                           templates,
                           onSelectTemplate
                       }: {
    templates: GoPhishTemplate[];
    onSelectTemplate: (template: GoPhishTemplate) => void;
}) {
    return (
        <div className="grid gap-4">
            {templates.length === 0 ? (
                <Card>
                    <CardContent className="pt-6 text-center">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Aucun template</h3>
                        <p className="text-muted-foreground mb-4">
                            Créez votre premier template d&apos;email de phishing
                        </p>
                    </CardContent>
                </Card>
            ) : (
                templates.map((template) => (
                    <Card
                        key={template.id}
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => onSelectTemplate(template)}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="flex items-center gap-2">
                                        {template.name}
                                        <Badge variant="outline">ID: {template.id}</Badge>
                                    </CardTitle>
                                    {template.subject && (
                                        <CardDescription className="mt-2">
                                            📧 {template.subject}
                                        </CardDescription>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectTemplate(template);
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

// Éditeur de template
function TemplateEditor({
                            template,
                            onTemplateChange,
                            onSave,
                            onCancel
                        }: {
    template: GoPhishTemplate;
    onTemplateChange: (template: GoPhishTemplate) => void;
    onSave: () => void;
    onCancel: () => void;
}) {
    const [viewMode, setViewMode] = useState<"split" | "code" | "preview">("split");

    const handleFieldChange = (field: keyof GoPhishTemplate, value: any) => {
        onTemplateChange({ ...template, [field]: value });
    };

    const insertVariable = (variable: string) => {
        const newHtml = (template.html || "") + variable;
        handleFieldChange("html", newHtml);
    };

    const formatHTML = () => {
        try {
            // Simple formatting (you can use prettier for better results)
            const formatted = template.html
                ?.replace(/></g, ">\n<")
                .replace(/\n\s*\n/g, "\n");
            handleFieldChange("html", formatted);
            toast.success("HTML formaté");
        } catch (error) {
            toast.error("Erreur de formatage");
        }
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <Label htmlFor="name">Nom du template *</Label>
                            <Input
                                id="name"
                                value={template.name}
                                onChange={(e) => handleFieldChange("name", e.target.value)}
                                placeholder="Mon Template"
                            />
                        </div>
                        <div>
                            <Label htmlFor="subject">Sujet de l&apos;email *</Label>
                            <Input
                                id="subject"
                                value={template.subject || ""}
                                onChange={(e) => handleFieldChange("subject", e.target.value)}
                                placeholder="Action urgente requise"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => insertVariable("{{.FirstName}}")}
                        >
                            Prénom
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => insertVariable("{{.LastName}}")}
                        >
                            Nom
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => insertVariable("{{.Email}}")}
                        >
                            Email
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => insertVariable("{{.Position}}")}
                        >
                            Poste
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => insertVariable('{{.URL}}')}
                        >
                            URL
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={formatHTML}
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Formater
                        </Button>
                    </div>

                    <div className="flex justify-between items-center">
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
                    <Card className="h-[600px]">
                        <CardHeader>
                            <CardTitle className="text-lg">Éditeur HTML</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[calc(100%-80px)]">
                            <Textarea
                                value={template.html || ""}
                                onChange={(e) => handleFieldChange("html", e.target.value)}
                                className="h-full font-mono text-sm resize-none"
                                placeholder="<html>...</html>"
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Preview */}
                {(viewMode === "split" || viewMode === "preview") && (
                    <Card className="h-[600px]">
                        <CardHeader>
                            <CardTitle className="text-lg">Aperçu</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[calc(100%-80px)] overflow-auto">
                            <Alert className="mb-4">
                                <AlertDescription>
                                    Les variables comme {`{{.FirstName}}`} seront remplacées lors de l&apos;envoi
                                </AlertDescription>
                            </Alert>
                            <iframe
                                srcDoc={template.html || ""}
                                className="w-full h-full border rounded"
                                sandbox="allow-same-origin"
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
function ImportTemplateDialog({
                                  open,
                                  onClose,
                                  onImport
                              }: {
    open: boolean;
    onClose: () => void;
    onImport: (template: GoPhishTemplate) => void;
}) {
    const [importData, setImportData] = useState({
        name: "",
        subject: "",
        html: "",
    });

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

    const handleImport = () => {
        if (!importData.name || !importData.html) {
            toast.error("Nom et HTML requis");
            return;
        }

        onImport({
            name: importData.name,
            subject: importData.subject,
            html: importData.html,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Importer un template</DialogTitle>
                    <DialogDescription>
                        Importez un template HTML existant
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="import-name">Nom du template</Label>
                        <Input
                            id="import-name"
                            value={importData.name}
                            onChange={(e) => setImportData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Mon template importé"
                        />
                    </div>

                    <div>
                        <Label htmlFor="import-subject">Sujet de l&apos;email</Label>
                        <Input
                            id="import-subject"
                            value={importData.subject}
                            onChange={(e) => setImportData(prev => ({ ...prev, subject: e.target.value }))}
                            placeholder="Sujet de l'email"
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

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Annuler
                        </Button>
                        <Button onClick={handleImport}>
                            <Upload className="mr-2 h-4 w-4" />
                            Importer
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}