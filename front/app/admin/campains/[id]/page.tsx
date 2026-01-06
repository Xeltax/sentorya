"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, MousePointer, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import Client from "@/utils/client";
import { ROUTES } from "@/utils/routes";
import { GoPhishCampaignSummary } from "@/types/GoPhish";
import { Campaign } from "@/types/Campaign";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function CampaignResultsPage() {
    const params = useParams();
    const router = useRouter();
    const campaignId = params.id as string;

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [results, setResults] = useState<GoPhishCampaignSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCampaignData();
    }, [campaignId]);

    const loadCampaignData = async () => {
        try {
            setLoading(true);

            // Charger les infos de la campagne
            const campaignResponse = await Client.get(ROUTES.BACK.CAMPAIGN.GET_BY_ID(campaignId));
            setCampaign(campaignResponse.data);

            // Charger les résultats GoPhish
            if (campaignResponse.data.goPhishCampaignId) {
                const resultsResponse = await Client.get(ROUTES.BACK.CAMPAIGN.GET_RESULTS(campaignId));
                setResults(resultsResponse.data);
            }
        } catch (error: any) {
            console.error("Erreur chargement données:", error);
            toast.error("Impossible de charger les données de la campagne");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardContent className="pt-6">
                        <p>Campagne non trouvée</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!campaign.goPhishCampaignId) {
        return (
            <div className="container mx-auto py-10">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                </Button>

                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">
                            Cette campagne n&apos;a pas été créée dans GoPhish.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const stats = results?.stats;

    return (
        <div className="container mx-auto py-10 space-y-6">
            {/* Header */}
            <div>
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                </Button>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">{campaign.name}</h1>
                        <p className="text-muted-foreground mt-2">
                            Résultats de la campagne GoPhish
                        </p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                        {results?.status || "En cours"}
                    </Badge>
                </div>
            </div>

            {/* Statistiques principales */}
            {stats && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Emails Envoyés</CardTitle>
                                <Mail className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.sent}</div>
                                <p className="text-xs text-muted-foreground">
                                    sur {stats.total} cibles
                                </p>
                                <Progress
                                    value={(stats.sent / stats.total) * 100}
                                    className="mt-2"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Emails Ouverts</CardTitle>
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.opened}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.sent > 0 ? Math.round((stats.opened / stats.sent) * 100) : 0}% d&apos;ouverture
                                </p>
                                <Progress
                                    value={(stats.opened / stats.sent) * 100}
                                    className="mt-2"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Liens Cliqués</CardTitle>
                                <MousePointer className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">{stats.clicked}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.sent > 0 ? Math.round((stats.clicked / stats.sent) * 100) : 0}% de clics
                                </p>
                                <Progress
                                    value={(stats.clicked / stats.sent) * 100}
                                    className="mt-2"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Données Soumises</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{stats.submitted_data}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.sent > 0 ? Math.round((stats.submitted_data / stats.sent) * 100) : 0}% ont soumis
                                </p>
                                <Progress
                                    value={(stats.submitted_data / stats.sent) * 100}
                                    className="mt-2"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Statistiques secondaires */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Emails Signalés</CardTitle>
                                <CardDescription>
                                    Utilisateurs ayant signalé l&apos;email comme suspect
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-green-600">
                                            {stats.emailReported}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {stats.sent > 0 ? Math.round((stats.emailReported / stats.sent) * 100) : 0}% de vigilance
                                        </p>
                                    </div>
                                    <CheckCircle className="h-12 w-12 text-green-600" />
                                </div>
                                <Progress
                                    value={(stats.emailReported / stats.sent) * 100}
                                    className="mt-4"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Erreurs</CardTitle>
                                <CardDescription>
                                    Emails non délivrés ou en erreur
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold">
                                            {stats.error}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {stats.total > 0 ? Math.round((stats.error / stats.total) * 100) : 0}% d&apos;erreur
                                        </p>
                                    </div>
                                    <AlertTriangle className="h-12 w-12 text-yellow-600" />
                                </div>
                                <Progress
                                    value={(stats.error / stats.total) * 100}
                                    className="mt-4"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Analyse de risque */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Analyse de Risque</CardTitle>
                            <CardDescription>
                                Évaluation du niveau de vulnérabilité détecté
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">Taux de vulnérabilité</span>
                                        <span className="font-bold text-orange-600">
                                            {stats.sent > 0 ? Math.round(((stats.clicked + stats.submitted_data) / stats.sent) * 100) : 0}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={((stats.clicked + stats.submitted_data) / stats.sent) * 100}
                                        className="h-2"
                                    />
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {stats.clicked + stats.submitted_data} utilisateurs ont interagi avec le phishing
                                    </p>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">Taux de vigilance</span>
                                        <span className="font-bold text-green-600">
                                            {stats.sent > 0 ? Math.round((stats.emailReported / stats.sent) * 100) : 0}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={(stats.emailReported / stats.sent) * 100}
                                        className="h-2"
                                    />
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {stats.emailReported} utilisateurs ont correctement signalé l&apos;email
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Informations de la campagne */}
            <Card>
                <CardHeader>
                    <CardTitle>Configuration de la campagne</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {campaign.templateName && (
                            <>
                                <dt className="font-medium">Template</dt>
                                <dd className="text-muted-foreground">{campaign.templateName}</dd>
                            </>
                        )}
                        {campaign.pageName && (
                            <>
                                <dt className="font-medium">Landing Page</dt>
                                <dd className="text-muted-foreground">{campaign.pageName}</dd>
                            </>
                        )}
                        {campaign.smtpProfileName && (
                            <>
                                <dt className="font-medium">Profil SMTP</dt>
                                <dd className="text-muted-foreground">{campaign.smtpProfileName}</dd>
                            </>
                        )}
                        {campaign.phishingUrl && (
                            <>
                                <dt className="font-medium">URL de phishing</dt>
                                <dd className="text-muted-foreground font-mono text-sm">{campaign.phishingUrl}</dd>
                            </>
                        )}
                    </dl>
                </CardContent>
            </Card>
        </div>
    );
}