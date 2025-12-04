"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types/User";
import UserActionsDatatable from "@/components/Datatable/UserActionsDatatable";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {Eye, Pen, Trash, UserMinus, UserPlus} from "lucide-react";
import OrganizationActionDatable from "@/components/Datatable/OrganizationActionDatable";
import {OrganizationsWithMembers} from "@/types/OrganizationsWithMembers";

export const columns = (
    users: User[]
): ColumnDef<OrganizationsWithMembers>[] => [
    {
        accessorKey: "name",
        header: "Nom",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phoneNumber",
        header: "Numéro de téléphone",
    },
    {
        accessorKey: "member",
        header: "Membres",
        cell : ({ row }) => {
            return (
                <span>
                    {row.original.member ? row.original.member.length <= 5 ? row.original.member.join(", ") : row.original.member.length : "Aucun membre"}
                </span>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: "Date de création",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt)
            return (
                <span>
                    {date.toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    })}{" "}
                    {date.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <OrganizationActionDatable organizations={row.original as OrganizationsWithMembers} users={users}/>
            )
        },
    },
]