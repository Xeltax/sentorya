"use client";

import { useState } from "react";
import { User } from "@/types/User";
import {columns} from "@/app/admin/users/columns";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Client from "@/utils/client";
import {ROUTES} from "@/utils/routes";
import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {DataTableWithSearch} from "@/components/Datatable/DatatableWithSearch";
import CreateUserDialog from "@/components/Popup/CreateUserDialog/createUserDialog";
import ConfirmUserCreateDialog from "@/components/Popup/ConfirmUserCreateDialog/confirmUserCreateDialog";

interface UsersDataTableProps {
    initialUsers: User[];
}

type UserFormData = {
    email: string;
    name: string;
    phoneNumber?: string;
    password?: string;
    role: string;
}

const UsersDataTable = ({ initialUsers }: UsersDataTableProps) => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [openDialog, setOpenDialog] = useState(false);

    const handleUserUpdate = (updatedUser: User) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === updatedUser.id ? updatedUser : user
            )
        );
    };

    const handleUserDelete = (userId: string) => {
        setUsers(prevUsers =>
            prevUsers.filter(user => user.id !== userId)
        );
    };

    const tableColumns = columns(handleUserUpdate, handleUserDelete)

    return (
        <>
            <Card className="mb-6 p-6">
                <h1 className="text-2xl font-bold">Liste des utilisateurs</h1>
                <p>
                    Vous pouvez gérer les utilisateurs ici. Cliquez sur les actions pour modifier ou supprimer un utilisateur ou bien ajouter en un.
                </p>
                <Button className="w-fit" onClick={() => setOpenDialog(true)}>
                    Ajouter un utilisateur
                </Button>
            </Card>

            <DataTableWithSearch columns={tableColumns} data={users}/>
            {openDialog && (
                // @ts-expect-error(2322): Issue with props type inference
                <CreateUserDialog isOpen={openDialog} toggle={() => setOpenDialog(!openDialog)} handleUsers={(users) => setUsers(prevUsers => [...prevUsers, users])}/>
            )}
        </>
    );
};

export default UsersDataTable;