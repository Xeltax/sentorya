"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Campaign } from "@/types/Campaign";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Eye, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const campaignColumns = (
    onCampaignUpdate: (campaign: Campaign) => void,
    onCampaignDelete: (campaignId: string) => void
): ColumnDef<Campaign>[] => [
    {
        accessorKey: "name",
        header: "Nom",
        cell: ({ row }) => {
            const campaign = row.original;
            return (
                <div>
                    <div className="font-medium">{campaign.name}</div>
                    {campaign.goPhishCampaignId && (
                        <Badge variant="outline" className="mt-1">
                            GoPhish #{campaign.goPhishCampaignId}
                        </Badge>
                    )}
                </div>
            );
        }
    },
    {
        accessorKey: "campaignId",
        header: "ID de la campagne",
    },
    {
        accessorKey: "organizationName",
        header: "Organisation",
    },
    {
        accessorKey: "goPhishCampaignId",
        header: "Statut",
        cell: ({ row }) => {
            const campaign = row.original;

            if (campaign.goPhishCampaignId) {
                return (
                    <Badge variant="default" className="bg-green-600">
                        Actif dans GoPhish
                    </Badge>
                );
            }

            return (
                <Badge variant="secondary">
                    Local uniquement
                </Badge>
            );
        }
    },
    {
        id: "gophish-info",
        header: "Détails GoPhish",
        cell: ({ row }) => {
            const campaign = row.original;

            if (!campaign.goPhishCampaignId) {
                return <span className="text-muted-foreground">-</span>;
            }

            return (
                <div className="text-sm space-y-1">
                    {campaign.templateName && (
                        <div className="text-muted-foreground">
                            📧 {campaign.templateName}
                        </div>
                    )}
                    {campaign.smtpProfileName && (
                        <div className="text-muted-foreground">
                            ✉️ {campaign.smtpProfileName}
                        </div>
                    )}
                </div>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const campaign = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        {campaign.goPhishCampaignId && (
                            <>
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/campains/${campaign.id}/results`}>
                                        <BarChart3 className="mr-2 h-4 w-4" />
                                        Voir les résultats
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}

                        <DropdownMenuItem asChild>
                            <Link href={`/admin/campains/${campaign.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Détails
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => onCampaignDelete(campaign.id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]