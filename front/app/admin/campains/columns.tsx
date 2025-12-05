"use client"

import { ColumnDef } from "@tanstack/react-table"
import {Campaign} from "@/types/Campaign";

export const columns = (
    onCampaignUpdate: (campaign: Campaign) => void,
    onCampaignDelete: (campaignId: string) => void
): ColumnDef<Campaign>[] => [
    {
        accessorKey: "name",
        header: "Nom",
    },
    {
        accessorKey: "campaignId",
        header: "ID de la campagne",
    },
    {
        accessorKey: "organizationName",
        header: "Entreprise liée",
    },
    {
        id: "actions",
        // cell: ({ row }) => {
        //     return (
        //         <UserActionsDatatable
        //             data={row.original}
        //             onUserUpdate={onCampaignUpdate}
        //             onUserDelete={onCampaignDelete}
        //         />
        //     )
        // },
    },
]