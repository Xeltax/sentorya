"use client"

import { ColumnDef } from "@tanstack/react-table"
import {User} from "@/types/User";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Eye, MoreHorizontal, Pen, Trash} from "lucide-react"

import { Button } from "@/components/ui/button"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

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
        cell: () => {
            return (
                <div className={"flex items-center gap-2"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" className="h-8 w-8 p-0">
                                <span className="sr-only"></span>
                                <Eye className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Voir l&apos;utilisateur</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="secondary" className="h-8 w-8 p-0">
                                <span className="sr-only"></span>
                                <Pen className="h-4 w-4"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Modifier l&apos;utilisateur</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="destructive" className="h-8 w-8 p-0">
                                <span className="sr-only"></span>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Supprimer l&apos;utilisateur</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            )
        },
    },
]