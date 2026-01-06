"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/Card/statCard/StatCard";
import { CampaignCard } from "@/components/Card/campaingCard/CampaignCard";
import {
    Mail,
    MousePointer,
    AlertTriangle,
    Filter,
    FileDown, TrendingUp, TrendingDown
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    CartesianGrid,
    Legend,
    ResponsiveContainer
} from "recharts";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import Client from "@/utils/client";
import { ROUTES } from "@/utils/routes";
import {
    transformGoPhishSummary,
    transformGoPhishCampaign,
    calculateStatsWithComparison,
    DashboardCampaign,
    DashboardTarget
} from "@/utils/gophishAdapter";
import { jwtDecode } from "jwt-decode";
import { UserJWT } from "@/types/UserJWT";
import { getCookie } from "cookies-next";
import {useLocalStorage} from "@/hooks/useLocalStorage";
import { getMockSummaries, getMockCampaignDetails } from '@/utils/mockGoPhish';
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export default function UserDashboardPage() {
    const [campaigns, setCampaigns] = useState<DashboardCampaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
    const [organizationId, setOrganizationId] = useState<string>("");
    const {getItem} = useLocalStorage()

    useEffect(() => {
        // Récupérer l'organizationId depuis le LocalStorage
        const orgId = getItem("organizationId");
        if (orgId) {
            setOrganizationId(orgId);
        } else {
            console.error("organizationId non trouvé dans le LocalStorage");
            toast.error("Impossible de récupérer l'organisation");
        }
    }, [getItem]);

    useEffect(() => {
        if (organizationId) {
            loadCampaigns();
        }
    }, [organizationId]);

    const loadCampaigns = async () => {
        try {
            setLoading(true);

            const response = USE_MOCK
                ? { data: getMockSummaries() }
                : await Client.get(ROUTES.BACK.CAMPAIGN.RESULT_BY_ORGANIZATION_ID(organizationId));

            const transformed = response.data.map(transformGoPhishSummary);
            console.log("Transformed campaigns:", transformed);
            const withComparison = calculateStatsWithComparison(transformed);
            setCampaigns(withComparison);
        } finally {
            setLoading(false);
        }
    };

    // Charger les détails d'une campagne (appelé quand on ouvre la card)
    const handleLoadCampaignDetails = async (goPhishId: number): Promise<DashboardTarget[]> => {
        try {
            console.log("Loading details for GoPhish ID:", goPhishId, "Mock mode:", USE_MOCK);
            const response = USE_MOCK
                ? { data: getMockCampaignDetails(goPhishId) }
                : await Client.get(ROUTES.BACK.GOPHISH.CAMPAIGN_BY_ID(goPhishId));

            console.log("Campaign details response:", response.data);

            const fullCampaign = transformGoPhishCampaign(response.data);
            return fullCampaign.targets;
        } catch (error) {
            console.error("Erreur chargement détails:", error);
            toast.error("Impossible de charger les détails de la campagne");
            return [];
        }
    };

    // Stats de la dernière campagne
    const lastCampaign = campaigns[0];
    const previousCampaign = campaigns[1];

    // Données pour le graphique temporel
    const timelineData = campaigns
        .map((campaign) => ({
            date: new Date(campaign.date).toLocaleDateString("fr-FR", {
                month: "short",
                year: "numeric"
            }),
            opened: campaign.stats.opened,
            clicked: campaign.stats.clicked,
            submitted: campaign.stats.submitted,
        }))
        .reverse(); // Plus ancien au début


    // Téléchargement PDF d'une campagne
    const handleDownloadCampaign = async (campaignId: string) => {
        toast.info("Génération du PDF en cours...");

        try {
            // TODO: Implémenter l'endpoint de génération PDF
            toast.success("PDF téléchargé ! (à implémenter)");
        } catch (error) {
            console.error("Erreur téléchargement:", error);
            toast.error("Erreur lors de la génération du PDF");
        }
    };

    // Téléchargement multiple avec filtres
    const handleBulkDownload = async () => {
        if (selectedCampaigns.length === 0) {
            toast.error("Veuillez sélectionner au moins une campagne");
            return;
        }

        toast.info(`Téléchargement de ${selectedCampaigns.length} campagne(s)...`);

        for (const campaignId of selectedCampaigns) {
            await handleDownloadCampaign(campaignId);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Mon Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Suivi de vos campagnes de sensibilisation à la cybersécurité
                </p>
            </div>

            <Tabs defaultValue="vue-generale" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="vue-generale">Vue Générale</TabsTrigger>
                    <TabsTrigger value="campagnes">Mes Campagnes</TabsTrigger>
                </TabsList>

                {/* Vue Générale */}
                <TabsContent value="vue-generale" className="space-y-6">
                    {/* Stats comparatives */}
                    {lastCampaign && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                title="Mails ouverts"
                                value={Math.round(lastCampaign.stats.opened)}
                                previousValue={previousCampaign?.stats.opened}
                                icon={<Mail className="h-4 w-4" />}
                            />
                            <StatCard
                                title="Liens cliqués"
                                value={Math.round(lastCampaign.stats.clicked)}
                                previousValue={previousCampaign?.stats.clicked}
                                icon={<MousePointer className="h-4 w-4" />}
                            />
                            <StatCard
                                title="Données envoyées"
                                value={Math.round(lastCampaign.stats.submitted)}
                                previousValue={previousCampaign?.stats.submitted}
                                icon={<AlertTriangle className="h-4 w-4" />}
                            />
                        </div>
                    )}

                    {/* Graphique global avec 3 blocs */}
                    {lastCampaign && previousCampaign && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Vue d&apos;ensemble - Dernière campagne</CardTitle>
                                <CardDescription>
                                    Comparaison des métriques avec la campagne précédente
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4 p-6">
                                    {/* Mails ouverts */}
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground mb-3">Mails ouverts</p>
                                        <div
                                            className={`rounded-lg p-8 ${
                                                lastCampaign.stats.opened > previousCampaign.stats.opened
                                                    ? "bg-red-500"
                                                    : "bg-green-500"
                                            }`}
                                        >
                                            <div className="text-white flex justify-center gap-3">
                                                <div className="text-5xl font-bold mb-2">
                                                    {lastCampaign.stats.opened}%
                                                </div>
                                                <div className="flex items-center justify-center gap-2">
                                                    {lastCampaign.stats.opened > previousCampaign.stats.opened ? (
                                                        <span className="text-2xl"><TrendingUp className="h-12 w-12 opacity-45" /></span>
                                                    ) : (
                                                        <span className="text-2xl"><TrendingDown className="h-12 w-12 opacity-45" /></span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Liens cliqués */}
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground mb-3">Liens cliqués</p>
                                        <div
                                            className={`rounded-lg p-8 ${
                                                lastCampaign.stats.clicked > previousCampaign.stats.clicked
                                                    ? "bg-red-500"
                                                    : "bg-green-500"
                                            }`}
                                        >
                                            <div className="text-white flex justify-center gap-3">
                                                <div className="text-5xl font-bold mb-2">
                                                    {lastCampaign.stats.clicked}%
                                                </div>
                                                <div className="flex items-center justify-center gap-2">
                                                    {lastCampaign.stats.clicked > previousCampaign.stats.clicked ? (
                                                        <span className="text-2xl"><TrendingUp className="h-12 w-12 opacity-45" /></span>
                                                    ) : (
                                                        <span className="text-2xl"><TrendingDown className="h-12 w-12 opacity-45" /></span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Données envoyées */}
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground mb-3">Données envoyées</p>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div
                                                    className={`rounded-lg p-8 ${
                                                        lastCampaign.stats.submitted > previousCampaign.stats.submitted
                                                            ? "bg-red-500"
                                                            : "bg-green-500"
                                                    }`}
                                                >
                                                    <div className="text-white flex justify-center gap-3">
                                                        <div className="text-5xl font-bold mb-2">
                                                            {lastCampaign.stats.submitted}%
                                                        </div>
                                                        <div className="flex items-center justify-center gap-2">
                                                            {lastCampaign.stats.submitted > previousCampaign.stats.submitted ? (
                                                                <span className="text-2xl"><TrendingUp className="h-12 w-12 opacity-45" /></span>
                                                            ) : (
                                                                <span className="text-2xl"><TrendingDown className="h-12 w-12 opacity-45" /></span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Tooltip de demo.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Graphique d'évolution temporelle */}
                    {timelineData.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Évolution dans le temps</CardTitle>
                                <CardDescription>
                                    Suivi des métriques sur l&apos;ensemble des campagnes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <AreaChart data={timelineData}>
                                        <defs>
                                            <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorClicked" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <RechartsTooltip contentStyle={{background : "#18181B"}} />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="opened"
                                            stroke="#10b981"
                                            fillOpacity={1}
                                            fill="url(#colorOpened)"
                                            name="Mails ouverts"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="clicked"
                                            stroke="#f59e0b"
                                            fillOpacity={1}
                                            fill="url(#colorClicked)"
                                            name="Liens cliqués"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="submitted"
                                            stroke="#ef4444"
                                            fillOpacity={1}
                                            fill="url(#colorSubmitted)"
                                            name="Données envoyées"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Liste des Campagnes */}
                <TabsContent value="campagnes" className="space-y-6">
                    {/* Actions groupées */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Mes Campagnes</CardTitle>
                                    <CardDescription>
                                        Visualisez et téléchargez vos rapports de campagnes
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline">
                                                <Filter className="mr-2 h-4 w-4" />
                                                Filtres
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <div className="space-y-4">
                                                <h4 className="font-medium">Sélectionner les campagnes</h4>
                                                {campaigns.map((campaign) => (
                                                    <div key={campaign.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={campaign.id}
                                                            checked={selectedCampaigns.includes(campaign.id)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    setSelectedCampaigns([...selectedCampaigns, campaign.id]);
                                                                } else {
                                                                    setSelectedCampaigns(
                                                                        selectedCampaigns.filter((id) => id !== campaign.id)
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        <Label htmlFor={campaign.id} className="text-sm">
                                                            {campaign.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <Button onClick={handleBulkDownload} disabled={selectedCampaigns.length === 0}>
                                        <FileDown className="mr-2 h-4 w-4" />
                                        Télécharger ({selectedCampaigns.length})
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Liste des campagnes */}
                    <div className="space-y-4">
                        {campaigns.map((campaign) => (
                            <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                                onDownload={handleDownloadCampaign}
                                onLoadDetails={handleLoadCampaignDetails}
                            />
                        ))}
                    </div>

                    {campaigns.length === 0 && (
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <p className="text-muted-foreground">
                                    Aucune campagne disponible pour le moment
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}