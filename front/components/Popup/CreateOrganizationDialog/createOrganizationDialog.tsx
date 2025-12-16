import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useState} from "react";
import {useForm} from "react-hook-form";
import Client from "@/utils/client";
import {ROUTES} from "@/utils/routes";
import {toast} from "sonner";
import {User} from "@/types/User";
import ConfirmUserCreateDialog from "@/components/Popup/ConfirmUserCreateDialog/confirmUserCreateDialog";
import {OrganizationsWithMembers} from "@/types/OrganizationsWithMembers";

type OrganizationFormData = {
    email: string;
    name: string;
    phoneNumber?: string;
    address?: string;
    ownerId?: string;
}

const CreateOrganizationDialog = (props : {isOpen : boolean, toggle : () => void, users : User[], createOrganization : (organization : OrganizationsWithMembers) => void}) => {
    const [formData, setFormData] = useState<OrganizationFormData>()
    const form = useForm<OrganizationFormData>();
    
    const createOrganisation = async (formData: OrganizationFormData) => {
        try {
            const response = await Client.post(ROUTES.BACK.ORGANIZATION.CRUD, formData);

            props.toggle()
            console.log("Orga created successfully:", response);
            form.reset();
            const responseData = {...response.data.organization, member: [response.data.members[0].email]};
            console.log(responseData);
            props.createOrganization(responseData);
            toast.success("Création de l'entreprise réussie !");

        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Echec lors de la création de l'entreprise. Veuillez réessayer.")
        }
    }

    const onSubmit = async (formData: OrganizationFormData) => {
        setFormData(formData);
        await createOrganisation(formData);
    };

    return (
        <>
            <Dialog
                open={props.isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setTimeout(() => {
                            props.toggle()
                            form.reset()
                        }, 0)
                    } else {
                        props.toggle()
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Création d&apos;une organization</DialogTitle>
                        <DialogDescription asChild>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                        name="address"
                                        defaultValue=""
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Adresse de l&apos;entreprise</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ex : 11 rue des fleurs Caen 14000" {...field} />
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
                                        name="ownerId"
                                        defaultValue=""
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Responsable de l&apos;entreprise</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Sélectionner un responsable" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {props.users.map((user) => (
                                                                <SelectItem key={user.id} value={user.id}>
                                                                    {user.email}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">
                                        {"Créer l'organization"}
                                    </Button>
                                </form>
                            </Form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreateOrganizationDialog;