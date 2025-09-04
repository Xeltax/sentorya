import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Eye, Pen, Trash } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useState } from "react";
import { User } from "@/types/User";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Client from "@/utils/client";
import { ROUTES } from "@/utils/routes";
import { toast } from "sonner"

type UserFormData = {
    id?: string
    email: string;
    name: string;
    organizationName?: string;
    phoneNumber?: string;
    role: string;
}

interface UserActionsDatatableProps {
    data: User;
    onUserUpdate: (user: User) => void;
    onUserDelete: (userId: string) => void;
}

const UserActionsDatatable = ({ data, onUserUpdate, onUserDelete }: UserActionsDatatableProps) => {
    const [openDialog, setOpenDialog] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    console.log(data);

    const form = useForm({
        defaultValues: {
            email: data.email,
            name: data.name,
            organizationName: data.organizationName || "",
            phoneNumber: data.phoneNumber || "",
            role: data.role,
        },
    });

    const onSubmit = async (formData: UserFormData) => {
        setIsLoading(true);
        try {
            formData.id = data.id;
            const response = await Client.put(ROUTES.BACK.USER.CRUD, formData);

            onUserUpdate(response.data);

            setOpenDialog("");
            console.log("User updated successfully:", response);
            toast.success("Modification de l'utilisateur réussie !");

        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Echec lors de la modification de l'utilisateur. Veuillez réessayer.")
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await Client.delete(`${ROUTES.BACK.USER.CRUD}/${data.id}`);

            onUserDelete(data.id);

            setOpenDialog("");
            console.log("User deleted successfully");
            toast.success("Suppression de l'utilisateur réussie !");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Echec lors de la suppression de l'utilisateur. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={"flex items-center gap-2"}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setOpenDialog("ViewUser")}>
                        <span className="sr-only">Voir</span>
                        <Eye className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Voir l&apos;utilisateur</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="secondary" className="h-8 w-8 p-0" onClick={() => setOpenDialog("EditUser")}>
                        <span className="sr-only">Modifier</span>
                        <Pen className="h-4 w-4"/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Modifier l&apos;utilisateur</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="destructive" className="h-8 w-8 p-0" onClick={() => setOpenDialog("DeleteUser")}>
                        <span className="sr-only">Supprimer</span>
                        <Trash className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Supprimer l&apos;utilisateur</p>
                </TooltipContent>
            </Tooltip>

            <Dialog
                open={openDialog !== ""}
                onOpenChange={(open) => setOpenDialog(open ? openDialog : "")}
            >
                {openDialog === "ViewUser" && (
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{data.email}</DialogTitle>
                            <DialogDescription asChild>
                                <div>
                                    Information de l&apos;utilisateur:
                                    <p><strong>Nom:</strong> {data.name}</p>
                                    <p><strong>Rôle:</strong> {data.role}</p>
                                    <p><strong>Entreprise lié :</strong> {data.organizationName}</p>
                                    <p><strong>N° de téléphone :</strong> {data.phoneNumber}</p>
                                    <p><strong>Crée le:</strong> {new Date(data.createdAt).toLocaleString()}</p>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                )}

                {openDialog === "EditUser" && (
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Modification de l&apos;utilisateur {data.email}</DialogTitle>
                            <DialogDescription asChild>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
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
                                            name="role"
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
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? "Modification..." : "Modifier"}
                                        </Button>
                                    </form>
                                </Form>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                )}

                {openDialog === "DeleteUser" && (
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Supprimer l&apos;utilisateur</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être annulée.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setOpenDialog("")}>
                                Annuler
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                                {isLoading ? "Suppression..." : "Supprimer"}
                            </Button>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
};

export default UserActionsDatatable;