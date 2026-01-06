"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Download,
    ChevronDown,
    ChevronUp,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CampaignCardProps {
    campaign: {
        id: string;
        name: string;
        reference: string;
        stats: {
            opened: number;
            clicked: number;
            submitted: number;
        };
        previousStats?: {
            opened: number;
            clicked: number;
            submitted: number;
        };
        targets: Array<{
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            opened: boolean;
            clicked: boolean;
            submitted: boolean;
            score: number;
        }>;
    };
    onDownload: (campaignId: string) => void;
}

export function CampaignCard({ campaign, onDownload }: CampaignCardProps) {
    const [isOpen, setIsOpen] = useState(false);

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

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card className="border-2">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <CardTitle className="text-lg">{campaign.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Réf: {campaign.reference}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onDownload(campaign.id)}
                            >
                                <Download className="h-4 w-4" />
                            </Button>
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
                    <div className="grid grid-cols-3 gap-3">
                        {/* Mails ouverts */}
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Mails ouverts</p>
                            <div
                                className={cn(
                                    "rounded p-3 text-white flex items-center justify-between",
                                    getStatColor(campaign.stats.opened, campaign.previousStats?.opened)
                                )}
                            >
                                <span className="font-bold text-xl">{campaign.stats.opened}%</span>
                                {getStatIcon(campaign.stats.opened, campaign.previousStats?.opened)}
                            </div>
                        </div>

                        {/* Liens cliqués */}
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Liens cliqués</p>
                            <div
                                className={cn(
                                    "rounded p-3 text-white flex items-center justify-between",
                                    getStatColor(campaign.stats.clicked, campaign.previousStats?.clicked)
                                )}
                            >
                                <span className="font-bold text-xl">{campaign.stats.clicked}%</span>
                                {getStatIcon(campaign.stats.clicked, campaign.previousStats?.clicked)}
                            </div>
                        </div>

                        {/* Données envoyées */}
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Données envoyées</p>
                            <div
                                className={cn(
                                    "rounded p-3 text-white flex items-center justify-between",
                                    getStatColor(campaign.stats.submitted, campaign.previousStats?.submitted)
                                )}
                            >
                                <span className="font-bold text-xl">{campaign.stats.submitted}%</span>
                                {getStatIcon(campaign.stats.submitted, campaign.previousStats?.submitted)}
                            </div>
                        </div>
                    </div>

                    {/* Tableau déroulant */}
                    <CollapsibleContent className="mt-4">
                        <div className="border rounded-lg overflow-hidden">
                            <div className="bg-muted p-3 grid grid-cols-7 gap-2 text-xs font-medium">
                                <div className="col-span-1">Nom</div>
                                <div className="col-span-1">Prénom</div>
                                <div className="col-span-2">Email</div>
                                <div className="text-center">Mail ouvert</div>
                                <div className="text-center">Lien cliqué</div>
                                <div className="text-center">Donnée envoyée</div>
                                <div className="text-center">Score</div>
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {campaign.targets.map((target) => (
                                    <div
                                        key={target.id}
                                        className="p-3 grid grid-cols-7 gap-2 text-sm border-t hover:bg-muted/50"
                                    >
                                        <div className="col-span-1 font-medium">{target.lastName}</div>
                                        <div className="col-span-1">{target.firstName}</div>
                                        <div className="col-span-2 text-muted-foreground">{target.email}</div>
                                        <div className="text-center">
                                            {target.opened ? (
                                                <CheckCircle2 className="h-5 w-5 text-red-500 mx-auto" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-green-500 mx-auto" />
                                            )}
                                        </div>
                                        <div className="text-center">
                                            {target.clicked ? (
                                                <CheckCircle2 className="h-5 w-5 text-red-500 mx-auto" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-green-500 mx-auto" />
                                            )}
                                        </div>
                                        <div className="text-center">
                                            {target.submitted ? (
                                                <CheckCircle2 className="h-5 w-5 text-red-500 mx-auto" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-green-500 mx-auto" />
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <Badge
                                                variant={target.score >= 70 ? "destructive" : target.score >= 40 ? "secondary" : "default"}
                                            >
                                                {target.score}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CollapsibleContent>
                </CardContent>
            </Card>
        </Collapsible>
    );
}