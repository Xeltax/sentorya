"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Download,
    ChevronDown,
    ChevronUp,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    XCircle,
    Loader2,
    Search,
    Filter,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    AlertCircle,
    Shield,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DashboardCampaign, DashboardTarget } from "@/utils/gophishAdapter";

interface CampaignCardProps {
    campaign: DashboardCampaign;
    onDownload: (campaignId: string) => void;
    onLoadDetails?: (goPhishId: number) => Promise<DashboardTarget[]>;
}

type SortField = "lastName" | "score" | "status";
type SortDirection = "asc" | "desc";

export function CampaignCard({ campaign, onDownload, onLoadDetails }: CampaignCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [targets, setTargets] = useState<DashboardTarget[]>(campaign.targets || []);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // États pour la recherche et les filtres
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState<SortField>("score");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [filters, setFilters] = useState({
        opened: true,
        notOpened: true,
        clicked: true,
        notClicked: true,
        submitted: true,
        notSubmitted: true,
        reported: true,
    });

    // Charger les détails quand on ouvre la carte
    useEffect(() => {
        if (isOpen && targets.length === 0 && onLoadDetails && campaign.goPhishId) {
            loadDetails();
        }
    }, [isOpen]);

    const loadDetails = async () => {
        if (!onLoadDetails || !campaign.goPhishId) return;

        try {
            setLoadingDetails(true);
            const details = await onLoadDetails(campaign.goPhishId);
            setTargets(details);
        } catch (error) {
            console.error("Erreur chargement détails:", error);
        } finally {
            setLoadingDetails(false);
        }
    };

    // Filtrage et tri des données
    const filteredAndSortedTargets = useMemo(() => {
        const filtered = targets.filter((target) => {
            // Filtre de recherche
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                target.firstName.toLowerCase().includes(searchLower) ||
                target.lastName.toLowerCase().includes(searchLower) ||
                target.email.toLowerCase().includes(searchLower);

            if (!matchesSearch) return false;

            // Filtres de status
            if (!filters.opened && target.opened) return false;
            if (!filters.notOpened && !target.opened) return false;
            if (!filters.clicked && target.clicked) return false;
            if (!filters.notClicked && !target.clicked) return false;
            if (!filters.submitted && target.submitted) return false;
            if (!filters.notSubmitted && !target.submitted) return false;
            if (!filters.reported && target.reported) return false;

            return true;
        });

        // Tri
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortField) {
                case "lastName":
                    aValue = a.lastName.toLowerCase();
                    bValue = b.lastName.toLowerCase();
                    break;
                case "score":
                    aValue = a.score;
                    bValue = b.score;
                    break;
                case "status":
                    aValue = a.status.toLowerCase();
                    bValue = b.status.toLowerCase();
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [targets, searchQuery, filters, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };

    const activeFiltersCount = Object.values(filters).filter((v) => !v).length;

    const getStatColor = (current: number, previous?: number) => {
        if (!previous) return "bg-gray-500";
        if (current > previous) return "bg-red-500";
        if (current < previous) return "bg-green-500";
        return "bg-gray-500";
    };

    const getStatIcon = (current: number, previous?: number) => {
        if (!previous) return null;
        if (current > previous) return <TrendingUp className="h-3 w-3" />;
        if (current < previous) return <TrendingDown className="h-3 w-3" />;
        return null;
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return "text-red-600 bg-red-50 border-red-200";
        if (score >= 40) return "text-orange-600 bg-orange-50 border-orange-200";
        return "text-green-600 bg-green-50 border-green-200";
    };

    const getScoreLabel = (score: number) => {
        if (score >= 70) return "Très vulnérable";
        if (score >= 40) return "Moyennement vulnérable";
        return "Vigilant";
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) {
            return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
        }
        return sortDirection === "asc" ? (
            <ArrowUp className="h-3 w-3 ml-1" />
        ) : (
            <ArrowDown className="h-3 w-3 ml-1" />
        );
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card className="border-2">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                                {campaign.name}
                                <Badge variant="outline" className="font-normal">
                                    {campaign.status}
                                </Badge>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Réf: {campaign.reference}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onDownload(campaign.id)}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Télécharger le rapport PDF</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <CollapsibleTrigger asChild>
                                <Button variant="outline" size="icon">
                                    {isOpen ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Statistiques en ligne */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {/* Mails ouverts */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="cursor-help">
                                        <p className="text-xs text-muted-foreground mb-2">Mails ouverts</p>
                                        <div
                                            className={cn(
                                                "rounded-lg p-3 text-white flex items-center justify-between",
                                                getStatColor(campaign.stats.opened, campaign.previousStats?.opened)
                                            )}
                                        >
                                            <span className="font-bold text-xl">{campaign.stats.opened}%</span>
                                            {getStatIcon(campaign.stats.opened, campaign.previousStats?.opened)}
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Pourcentage d&apos;utilisateurs ayant ouvert l&apos;email</p>
                                    {campaign.previousStats && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Précédent: {campaign.previousStats.opened}%
                                        </p>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Liens cliqués */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="cursor-help">
                                        <p className="text-xs text-muted-foreground mb-2">Liens cliqués</p>
                                        <div
                                            className={cn(
                                                "rounded-lg p-3 text-white flex items-center justify-between",
                                                getStatColor(campaign.stats.clicked, campaign.previousStats?.clicked)
                                            )}
                                        >
                                            <span className="font-bold text-xl">{campaign.stats.clicked}%</span>
                                            {getStatIcon(campaign.stats.clicked, campaign.previousStats?.clicked)}
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Pourcentage d&apos;utilisateurs ayant cliqué sur le lien</p>
                                    {campaign.previousStats && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Précédent: {campaign.previousStats.clicked}%
                                        </p>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Données envoyées */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="cursor-help">
                                        <p className="text-xs text-muted-foreground mb-2">Données envoyées</p>
                                        <div
                                            className={cn(
                                                "rounded-lg p-3 text-white flex items-center justify-between transition-all",
                                                getStatColor(campaign.stats.submitted, campaign.previousStats?.submitted)
                                            )}
                                        >
                                            <span className="font-bold text-xl">{campaign.stats.submitted}%</span>
                                            {getStatIcon(campaign.stats.submitted, campaign.previousStats?.submitted)}
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Pourcentage d&apos;utilisateurs ayant soumis leurs données</p>
                                    {campaign.previousStats && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Précédent: {campaign.previousStats.submitted}%
                                        </p>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {/* Tableau déroulant avec DataTable */}
                    <CollapsibleContent className="mt-4">
                        {loadingDetails ? (
                            <div className="flex flex-col justify-center items-center p-12 space-y-4">
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Chargement des détails...</p>
                            </div>
                        ) : targets.length === 0 ? (
                            <div className="text-center p-12 text-muted-foreground border rounded-lg bg-muted/20">
                                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="font-medium">Aucune donnée disponible</p>
                                <p className="text-sm mt-1">Cette campagne ne contient pas encore de résultats</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Barre de recherche et filtres */}
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Rechercher par nom, prénom ou email..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-10"
                                        />
                                        {searchQuery && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                                                onClick={() => setSearchQuery("")}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="gap-2">
                                                <Filter className="h-4 w-4" />
                                                Filtres
                                                {activeFiltersCount > 0 && (
                                                    <Badge variant="secondary" className="ml-1 px-1.5">
                                                        {activeFiltersCount}
                                                    </Badge>
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel>Afficher les utilisateurs</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuCheckboxItem
                                                checked={filters.opened}
                                                onCheckedChange={(checked) =>
                                                    setFilters({ ...filters, opened: checked })
                                                }
                                            >
                                                <CheckCircle2 className="h-4 w-4 mr-2 text-red-500" />
                                                Ayant ouvert
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                checked={filters.notOpened}
                                                onCheckedChange={(checked) =>
                                                    setFilters({ ...filters, notOpened: checked })
                                                }
                                            >
                                                <XCircle className="h-4 w-4 mr-2 text-green-500" />
                                                N&apos;ayant pas ouvert
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuCheckboxItem
                                                checked={filters.clicked}
                                                onCheckedChange={(checked) =>
                                                    setFilters({ ...filters, clicked: checked })
                                                }
                                            >
                                                <CheckCircle2 className="h-4 w-4 mr-2 text-red-500" />
                                                Ayant cliqué
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                checked={filters.notClicked}
                                                onCheckedChange={(checked) =>
                                                    setFilters({ ...filters, notClicked: checked })
                                                }
                                            >
                                                <XCircle className="h-4 w-4 mr-2 text-green-500" />
                                                N&apos;ayant pas cliqué
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuCheckboxItem
                                                checked={filters.submitted}
                                                onCheckedChange={(checked) =>
                                                    setFilters({ ...filters, submitted: checked })
                                                }
                                            >
                                                <CheckCircle2 className="h-4 w-4 mr-2 text-red-500" />
                                                Ayant soumis
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                checked={filters.notSubmitted}
                                                onCheckedChange={(checked) =>
                                                    setFilters({ ...filters, notSubmitted: checked })
                                                }
                                            >
                                                <XCircle className="h-4 w-4 mr-2 text-green-500" />
                                                N&apos;ayant pas soumis
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuCheckboxItem
                                                checked={filters.reported}
                                                onCheckedChange={(checked) =>
                                                    setFilters({ ...filters, reported: checked })
                                                }
                                            >
                                                <Shield className="h-4 w-4 mr-2 text-blue-500" />
                                                Ayant signalé
                                            </DropdownMenuCheckboxItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Info nombre de résultats */}
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>
                                        {filteredAndSortedTargets.length} résultat{filteredAndSortedTargets.length > 1 ? 's' : ''}
                                        {searchQuery && ` pour "${searchQuery}"`}
                                    </span>
                                    {(searchQuery || activeFiltersCount > 0) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSearchQuery("");
                                                setFilters({
                                                    opened: true,
                                                    notOpened: true,
                                                    clicked: true,
                                                    notClicked: true,
                                                    submitted: true,
                                                    notSubmitted: true,
                                                    reported: true,
                                                });
                                            }}
                                        >
                                            Réinitialiser
                                        </Button>
                                    )}
                                </div>

                                {/* DataTable */}
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead
                                                    className="cursor-pointer"
                                                    onClick={() => handleSort("lastName")}
                                                >
                                                    <div className="flex items-center">
                                                        Nom
                                                        <SortIcon field="lastName" />
                                                    </div>
                                                </TableHead>
                                                <TableHead>Prénom</TableHead>
                                                <TableHead className="w-[250px]">Email</TableHead>
                                                <TableHead className="text-center">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger className="cursor-help">
                                                                Mail ouvert
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>A ouvert l&apos;email de phishing</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger className="cursor-help">
                                                                Lien cliqué
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>A cliqué sur le lien malveillant</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger className="cursor-help">
                                                                Données
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>A soumis ses identifiants</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableHead>
                                                <TableHead
                                                    className="text-center cursor-pointer"
                                                    onClick={() => handleSort("score")}
                                                >
                                                    <div className="flex items-center justify-center">
                                                        Score
                                                        <SortIcon field="score" />
                                                    </div>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredAndSortedTargets.map((target) => (
                                                <TableRow
                                                    key={target.id}
                                                >
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            {target.lastName}
                                                            {target.reported && (
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <Shield className="h-4 w-4 text-blue-500" />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>A signalé l&apos;email comme suspect</p>
                                                                            <p className="text-xs text-green-400 mt-1">
                                                                                ✓ Comportement exemplaire
                                                                            </p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{target.firstName}</TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {target.email}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {target.opened ? (
                                                            <CheckCircle2 className="h-5 w-5 text-red-500 mx-auto" />
                                                        ) : (
                                                            <XCircle className="h-5 w-5 text-green-500 mx-auto" />
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {target.clicked ? (
                                                            <CheckCircle2 className="h-5 w-5 text-red-500 mx-auto" />
                                                        ) : (
                                                            <XCircle className="h-5 w-5 text-green-500 mx-auto" />
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {target.submitted ? (
                                                            <CheckCircle2 className="h-5 w-5 text-red-500 mx-auto" />
                                                        ) : (
                                                            <XCircle className="h-5 w-5 text-green-500 mx-auto" />
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={cn(
                                                                            "font-semibold cursor-help",
                                                                            getScoreColor(target.score)
                                                                        )}
                                                                    >
                                                                        {target.score}
                                                                    </Badge>
                                                                </TooltipTrigger>
                                                                <TooltipContent className="max-w-xs">
                                                                    <p className="font-semibold mb-2">
                                                                        {getScoreLabel(target.score)}
                                                                    </p>
                                                                    <div className="text-xs space-y-1">
                                                                        <p>Calcul du score :</p>
                                                                        <p>• Email ouvert : {target.opened ? '+30' : '0'} pts</p>
                                                                        <p>• Lien cliqué : {target.clicked ? '+40' : '0'} pts</p>
                                                                        <p>• Données soumises : {target.submitted ? '+30' : '0'} pts</p>
                                                                        <div className="mt-2 pt-2 border-t">
                                                                            <p className="font-medium">
                                                                                Total : {target.score}/100
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Message si aucun résultat */}
                                {filteredAndSortedTargets.length === 0 && (
                                    <div className="text-center p-8 text-muted-foreground">
                                        <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p>Aucun résultat trouvé</p>
                                        <p className="text-sm mt-1">Essayez de modifier vos filtres ou votre recherche</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CollapsibleContent>
                </CardContent>
            </Card>
        </Collapsible>
    );
}