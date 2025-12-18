import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {User} from "@/types/User";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {OrganizationRole} from "@/types/OrganizationRole";
import {ROUTES} from "@/utils/routes";
import Client from "@/utils/client";
import {toast} from "sonner";
import {useOrganizations} from "@/components/context/OrganizationContext";

type AddMemberFormData = {
    organizationId: string;
    userId: string;
    role : OrganizationRole;
}

const AddMemberDialog = (props: {isOpen: boolean, toggle : () => void, organization : Organizations, users : User[]}) => {
    const [formData, setFormData] = useState<AddMemberFormData>()
    const {addMember} = useOrganizations();
    const form = useForm<AddMemberFormData>();

    const onSubmit = async (formData: AddMemberFormData) => {
        formData.organizationId = props.organization.id;
        setFormData(formData);

        try {
            const response = await Client.put(ROUTES.BACK.ORGANIZATION.ADD_MEMBER, formData);
            addMember(props.organization.id, response.data);
            props.toggle()
            console.log("Member added successfully:", response);
            form.reset();
            toast.success("Ajout du membre réussi !");
        } catch (error) {
            console.log(error);
            toast.error("Echec lors de l'ajout du membre. Veuillez réessayer.")
        }
    }

    return (
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
                    <DialogTitle className={"mb-4"}>Ajout d&apos;un membre à &#34;{props.organization.name}&#34;</DialogTitle>
                    <DialogDescription asChild>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="userId"
                                    defaultValue=""
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Utilisateurs</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Sélectionner un utilisateur" />
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
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role dans l&apos;entreprise</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Sélectionner un role"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={"ADMIN"}>
                                                            Administrateur
                                                        </SelectItem>
                                                        <SelectItem value={"MEMBER"}>
                                                            Membre
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">
                                    {"Ajouter le membre"}
                                </Button>
                            </form>
                        </Form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AddMemberDialog