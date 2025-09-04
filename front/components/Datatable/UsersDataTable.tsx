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

interface UsersDataTableProps {
    initialUsers: User[];
}

type UserFormData = {
    email: string;
    name: string;
    organizationName?: string;
    phoneNumber?: string;
    password?: string;
    role: string;
}

const UsersDataTable = ({ initialUsers }: UsersDataTableProps) => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmCreate, setConfirmCreate] = useState(false);
    const [formData, setFormData] = useState<UserFormData>()
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
        if (!formData.role) {
            formData.role = "USER";
        }
        setFormData(formData);

        if (formData.role === "ADMIN" && !confirmCreate) {
            setConfirmCreate(true);
        } else {
            await createUser(formData);
            setConfirmCreate(false);
        }
    };

    const createUser = async (formData: UserFormData) => {
        try {
            const response = await Client.post(ROUTES.BACK.USER.CRUD, formData);

            setOpenDialog(false);
            console.log("User created successfully:", response);
            setUsers(prevUsers => [...prevUsers, response.data]);
            form.reset();
            toast.success("Création de l'utilisateur réussie !");
            setConfirmCreate(false);

        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Echec lors de la création de l'utilisateur. Veuillez réessayer.")
        }
    }

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
                <Dialog
                    open={openDialog}
                    onOpenChange={(open) => {
                        setOpenDialog(open)
                        form.reset()
                    }}
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
                                            rules={{ required: "L'email est requis" }}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <FormItem aria-required={true}>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type={"email"} placeholder="email@example.com" {...field} />
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
                                            name="organizationName"
                                            defaultValue=""
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Entreprise</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Nom de l'entreprise" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phoneNumber"
                                            defaultValue=""
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Numéro de téléphone</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Numéro de tel" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            rules={{ required: "Le mot de passe dois être généré" }}
                                            render={({ field }) => (
                                                <FormItem aria-required={true}>
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
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Role</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={"USER"}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Role"/>
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

            {confirmCreate && (
                <Dialog
                    open={confirmCreate}
                    onOpenChange={(open) => setConfirmCreate(open)}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer un compte administrateur ?</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir créer un compte administrateur ?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => {setConfirmCreate(false)}}>
                                Annuler
                            </Button>
                            <Button variant="secondary" onClick={() => createUser(formData!)}>
                                Confirmer la création
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default UsersDataTable;