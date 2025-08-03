"use client";

import { useState } from "react";
import { User } from "@/types/User";
import { DataTable } from "@/app/admin/users/data-table";
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

interface UsersDataTableProps {
    initialUsers: User[];
}

type UserFormData = {
    email: string;
    name: string;
    password?: string;
    role: string;
}

const UsersDataTable = ({ initialUsers }: UsersDataTableProps) => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [openDialog, setOpenDialog] = useState(false);
    const form = useForm<UserFormData>();

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

    const onSubmit = async (formData: UserFormData) => {
        try {
            const response = await Client.post(ROUTES.BACK.USER.CRUD, formData);

            setOpenDialog(false);
            console.log("User created successfully:", response);
            setUsers(prevUsers => [...prevUsers, response.data]);
            form.reset();
            toast.success("Créatoion de l'utilisateur réussie !");

        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Echec lors de la création de l'utilisateur. Veuillez réessayer.")
        }
    };

    const generateRandomPassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }

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
            <DataTable
                columns={columns(handleUserUpdate, handleUserDelete)}
                data={users}
            />
            {openDialog && (
                <Dialog
                    open={openDialog}
                    onOpenChange={(open) => setOpenDialog(open)}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Création d&apos;un utilisateurs</DialogTitle>
                            <DialogDescription asChild>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            defaultValue=""
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="email@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            defaultValue=""
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nom</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Nom complet" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mot de passe</FormLabel>
                                                    <FormControl>
                                                        <div className={"flex items-center gap-2"}>
                                                            <Input
                                                                placeholder="Mot de passe"
                                                                readOnly={true}
                                                                type="text"
                                                                value={field.value || ""}
                                                                ></Input>
                                                            <Button
                                                                type="button"
                                                                onClick={() => field.onChange(generateRandomPassword())}>
                                                                Générer un mot de passe
                                                            </Button>
                                                        </div>

                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="role"
                                            defaultValue=""
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Role</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Role" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="USER">USER</SelectItem>
                                                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit">
                                            {"Créer l'utilisateur"}
                                        </Button>
                                    </form>
                                </Form>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default UsersDataTable;