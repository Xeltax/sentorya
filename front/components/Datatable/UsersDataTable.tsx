"use client";

import { useState } from "react";
import { User } from "@/types/User";
import {userColumns} from "@/app/admin/users/userColumns";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {DataTableWithSearch} from "@/components/Datatable/DatatableWithSearch";
import CreateUserDialog from "@/components/Popup/CreateUserDialog/createUserDialog";

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

    const tableColumns = userColumns(handleUserUpdate, handleUserDelete)

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