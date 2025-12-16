import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {ROUTES} from "@/utils/routes";
import Client from "@/utils/client";
import {toast} from "sonner";

type EditOrganizationFormData = {
    email?: string;
    name: string;
    phoneNumber?: string;
    address?: string;
}

const EditOrganizationDialog = (props : {isOpen: boolean, toggle : () => void, organization : Organizations, callback : (data : Organizations) => void}) => {
    const [formData, setFormData] = useState<EditOrganizationFormData>()
    const form = useForm<EditOrganizationFormData>();

    const onSubmit = async (formData: EditOrganizationFormData) => {
        setFormData(formData);
        await editOrganisation(formData);
    };

    const editOrganisation = async (formData: EditOrganizationFormData) => {
        try {
            const response = await Client.put(ROUTES.BACK.ORGANIZATION.CRUD, {...formData, id: props.organization.id});

            props.toggle()
            console.log("Orga edited successfully:", response);
            form.reset();
            props.callback(response.data);
            toast.success("Modification de l'entreprise réussie !");
        } catch (error) {
            console.error("Error updating organization:", error);
            toast.error("Echec lors de la modification de l'entreprise. Veuillez réessayer.")
        }
    }
    
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
                        <DialogTitle>Modification de l&apos;entreprise &#34;{props.organization.name}&#34;</DialogTitle>
                        <DialogDescription asChild>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        defaultValue={props.organization.name}
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
                                        defaultValue={props.organization.email}
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
                                        // @ts-expect-error("address can be null")
                                        defaultValue={props.organization.address}
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
                                        // @ts-expect-error("phoneNumber can be null")
                                        defaultValue={props.organization.phoneNumber}
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
                                    <Button type="submit">
                                        {"Modifier l'entreprise"}
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

export default EditOrganizationDialog;