import {User} from "@/types/User";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {OrganizationRole} from "@/types/OrganizationRole";
import {OrganizationsWithMembers} from "@/types/OrganizationsWithMembers";
import {ROUTES} from "@/utils/routes";
import Client from "@/utils/client";
import {toast} from "sonner";

type RemoveMemberFormData = {
    organizationId: string;
    userId: string;
}


const DeleteMemberDialog = (props : {isOpen : boolean, toggle : () => void, organization : OrganizationsWithMembers, users : User[]}) => {
    const [formData, setFormData] = useState<RemoveMemberFormData>()
    const form = useForm<RemoveMemberFormData>();
    const [members, setMembers] = useState<User[]>([]);
    
    useEffect(() => {
        const orgMembers = props.organization.member || [];
        const linkedMembers = props.users.filter(user => orgMembers.includes(user.email));
        setMembers(linkedMembers);
    }, [props.organization.member, props.users])
    
    const onSubmit = async (formData: RemoveMemberFormData) => {
        formData.organizationId = props.organization.id;
        setFormData(formData);
        
        try {
            const response = await Client.put(ROUTES.BACK.ORGANIZATION.REMOVE_MEMBER, formData);
            
            props.toggle()
            console.log("Member removed successfully:", response);
            form.reset();
            toast.success("Suppression du membre réussi !");
        } catch (error : any) {
            console.error("Error removing member:", error);
            toast.error(error.response.data)
        }
    }
    
    
    return (
        <Dialog
            open={props.isOpen}
            onOpenChange={(open) => {
                props.toggle()
                form.reset()
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className={"mb-4"}>Suppression d&apos;un membre à &#34;{props.organization.name}&#34;</DialogTitle>
                    <DialogDescription asChild>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="userId"
                                    defaultValue=""
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Membre de l&apos;organisation</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Sélectionner un utilisateur" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {members.map((user) => (
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
                                    {"Supprimer le membre"}
                                </Button>
                            </form>
                        </Form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteMemberDialog