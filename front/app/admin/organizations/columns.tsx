"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types/User";
import UserActionsDatatable from "@/components/shared/UserActionsDatatable";

export const columns = (
    // onUserUpdate: (user: User) => void,
    // onUserDelete: (userId: string) => void
): ColumnDef<Organizations>[] => [
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "name",
        header: "Nom",
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
    // {
    //     id: "actions",
    //     cell: ({ row }) => {
    //         return (
    //             <UserActionsDatatable
    //                 data={row.original}
    //                 onUserUpdate={onUserUpdate}
    //                 onUserDelete={onUserDelete}
    //             />
    //         )
    //     },
    // },
]