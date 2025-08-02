"use client"

import { ColumnDef } from "@tanstack/react-table"
import {User} from "@/types/User";
import {Eye, Pen, Trash} from "lucide-react"

import { Button } from "@/components/ui/button"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import UserActionsDatatable from "@/components/shared/UserActionsDatatable";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "name",
        header: "Nom",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "createdAt",
        header: "Date de création",
        cell : ({ row }) => {
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
                <UserActionsDatatable data={row.original}/>
            )
        },
    },
]