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
    Download,
    Filter,
    FileDown,
    Users, TrendingUp, TrendingDown
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import Client from "@/utils/client";
import {ROUTES} from "@/utils/routes";
import {useLocalStorage} from "@/hooks/useLocalStorage";

// Types
interface CampaignStats {
    opened: number;
    clicked: number;
    submitted: number;
}

interface Campaign {
    id: string;
    name: string;
    reference: string;
    date: string;
    stats: CampaignStats;
    previousStats?: CampaignStats;
    targets: Array<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        opened: boolean;
        clicked: boolean;
        submitted: boolean;
        score: number;
        department?: string;
    }>;
}

export default function UserDashboardPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
    const [filterDepartment, setFilterDepartment] = useState<string>("all");
    const {getItem} = useLocalStorage();
    const organizationId = getItem("organizationId") || "";

    console.log(organizationId);

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        try {
            setLoading(true);
            const response = await Client.get(ROUTES.BACK.CAMPAIGN.GET_BY_ORGANIZATION_ID(organizationId));
            console.log(response)
            setCampaigns(response.data);
        } catch (error) {
            console.error("Erreur chargement campagnes:", error);
            toast.error("Impossible de charger les campagnes");
        } finally {
            setLoading(false);
        }
    };

    // Calcul des stats globales
    const globalStats = campaigns.reduce(
        (acc, campaign) => {
            const total = campaigns.length;
            return {
                opened: acc.opened + campaign.stats.opened / total,
                clicked: acc.clicked + campaign.stats.clicked / total,
                submitted: acc.submitted + campaign.stats.submitted / total,
            };
        },
        { opened: 0, clicked: 0, submitted: 0 }
    );

    // Stats de la dernière campagne
    const lastCampaign = campaigns[0];
    const previousCampaign = campaigns[1];

    // Données pour le graphique temporel
    const timelineData = campaigns.map((campaign) => ({
        date: new Date(campaign.date).toLocaleDateString("fr-FR", {
            month: "short",
            year: "numeric"
        }),
        opened: campaign.stats.opened,
        clicked: campaign.stats.clicked,
        submitted: campaign.stats.submitted,
    })).reverse();

    // Téléchargement PDF d'une campagne
    const handleDownloadCampaign = async (campaignId: string) => {
        toast.info("Génération du PDF en cours...");
        // TODO: Implémenter la génération PDF
        setTimeout(() => {
            toast.success("PDF téléchargé !");
        }, 1500);
    };

    // Téléchargement multiple avec filtres
    const handleBulkDownload = () => {
        if (selectedCampaigns.length === 0) {
            toast.error("Veuillez sélectionner au moins une campagne");
            return;
        }
        toast.info(`Téléchargement de ${selectedCampaigns.length} campagne(s)...`);
        // TODO: Implémenter le téléchargement groupé
    };

    // Filtrage par département
    const departments = Array.from(
        new Set(
            campaigns.flatMap(c =>
                c.targets.map(t => t.department).filter(Boolean)
            )
        )
    );

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

            {campaigns.length === 0 ? (
                <Card>
                    <CardTitle className="text-center">
                        <p className="text-muted-foreground">
                            Aucune campagne disponible pour le moment. Veuillez patienter le temps de la mise en place de celles-ci.
                        </p>
                    </CardTitle>
                </Card>
            ):
                (
                    <Tabs defaultValue="vue-generale" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="vue-generale">Vue Générale</TabsTrigger>
                            <TabsTrigger value="campagnes">Mes Campagnes</TabsTrigger>
                        </TabsList>

                        {/* Vue Générale */}
                        <TabsContent value="vue-generale" className="space-y-6">
                            {/* Stats comparatives */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard
                                    title="Mails ouverts"
                                    value={Math.round(lastCampaign?.stats.opened || 0)}
                                    previousValue={previousCampaign?.stats.opened}
                                    icon={<Mail className="h-4 w-4" />}
                                />
                                <StatCard
                                    title="Liens cliqués"
                                    value={Math.round(lastCampaign?.stats.clicked || 0)}
                                    previousValue={previousCampaign?.stats.clicked}
                                    icon={<MousePointer className="h-4 w-4" />}
                                />
                                <StatCard
                                    title="Données envoyées"
                                    value={Math.round(lastCampaign?.stats.submitted || 0)}
                                    previousValue={previousCampaign?.stats.submitted}
                                    icon={<AlertTriangle className="h-4 w-4" />}
                                />
                            </div>

                            {/* Graphique global avec 3 blocs */}
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
                                                    (lastCampaign?.stats.opened || 0) > (previousCampaign?.stats.opened || 0)
                                                        ? "bg-red-500"
                                                        : "bg-green-500"
                                                }`}
                                            >
                                                <div className="text-white">
                                                    <div className="text-5xl font-bold mb-2">
                                                        {lastCampaign?.stats.opened || 0}%
                                                    </div>
                                                    <div className="flex items-center justify-center gap-2">
                                                        {(lastCampaign?.stats.opened || 0) > (previousCampaign?.stats.opened || 0) ? (
                                                            <span className="text-2xl"><TrendingUp className="h-12 w-12" /></span>
                                                        ) : (
                                                            <span className="text-2xl"><TrendingDown className="h-12 w-12" /></span>
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
                                                    (lastCampaign?.stats.clicked || 0) > (previousCampaign?.stats.clicked || 0)
                                                        ? "bg-red-500"
                                                        : "bg-green-500"
                                                }`}
                                            >
                                                <div className="text-white">
                                                    <div className="text-5xl font-bold mb-2">
                                                        {lastCampaign?.stats.clicked || 0}%
                                                    </div>
                                                    <div className="flex items-center justify-center gap-2">
                                                        {(lastCampaign?.stats.clicked || 0) > (previousCampaign?.stats.clicked || 0) ? (
                                                            <span className="text-2xl"><TrendingUp className="h-12 w-12" /></span>
                                                        ) : (
                                                            <span className="text-2xl"><TrendingDown className="h-12 w-12" /></span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Données envoyées */}
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground mb-3">Données envoyées</p>
                                            <div
                                                className={`rounded-lg p-8 ${
                                                    (lastCampaign?.stats.submitted || 0) > (previousCampaign?.stats.submitted || 0)
                                                        ? "bg-red-500"
                                                        : "bg-green-500"
                                                }`}
                                            >
                                                <div className="text-white">
                                                    <div className="text-5xl font-bold mb-2">
                                                        {lastCampaign?.stats.submitted || 0}%
                                                    </div>
                                                    <div className="flex items-center justify-center gap-2">
                                                        {(lastCampaign?.stats.submitted || 0) > (previousCampaign?.stats.submitted || 0) ? (
                                                            <span className="text-2xl"><TrendingUp className="h-12 w-12" /></span>
                                                        ) : (
                                                            <span className="text-2xl"><TrendingDown className="h-12 w-12" /></span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Graphique d'évolution temporelle */}
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
                                            <Tooltip contentStyle={{background : "#18181B"}} />
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

                            {/* Filtrage par département */}
                            {departments.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Analyse par département</CardTitle>
                                        <CardDescription>
                                            Suivez les performances de chaque équipe
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4 mb-4">
                                            <Users className="h-5 w-5 text-muted-foreground" />
                                            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                                                <SelectTrigger className="w-[200px]">
                                                    <SelectValue placeholder="Tous les départements" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Tous les départements</SelectItem>
                                                    {departments.map((dept) => (
                                                        <SelectItem key={dept} value={dept || ""}>
                                                            {dept}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <p className="text-sm text-muted-foreground">
                                            Sélectionnez un département pour voir les statistiques détaillées
                                        </p>
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
                                            <Button onClick={handleBulkDownload}>
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
                )
            }
        </div>
    );
}