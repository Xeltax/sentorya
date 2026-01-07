import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {ROUTES} from "@/utils/routes";
import Client from "@/utils/client";
import {setCookie} from "cookies-next";
import {UserJWT} from "@/types/UserJWT";

const ChangePasswordPopup= (props: {isOpen : boolean, toggle : () => void, userJWT : UserJWT | null}) => {
    const [formData, setFormData] = useState<{
        password: string;
        confirmPassword: string;
    }>()

    const form = useForm<{
        password: string;
        confirmPassword: string;
    }>();

    const onSubmit = async (data: {password: string, confirmPassword : string}) => {
        setFormData(data);
        // Here you can handle the password creation logic, e.g., send it to the server
        console.log("Password created:", data.password);

        try {
            console.log(ROUTES.BACK.AUTH.CHANGE_PASSWORD_FIRST_LOGIN + `/${props.userJWT?.userId}`)
            const response = await Client.put(
                ROUTES.BACK.AUTH.CHANGE_PASSWORD_FIRST_LOGIN + `/${props.userJWT?.userId}`,
                {password: data.password}
            );

            if (response.status === 204) {
                console.log("Password updated successfully.");

                const loginResponse = await Client.post(ROUTES.BACK.AUTH.LOGIN, {
                    email: props.userJWT?.email,
                    password: data.password
                });

                if (loginResponse.status === 200 && loginResponse.data.token) {
                    const token = loginResponse.data.token;
                    localStorage.setItem("JWT", token);
                    setCookie("JWT", token, {
                        maxAge: 60 * 60 * 24 * 7, // 7 days
                    })
                    window.location.href = "/dashboard";
                } else {
                    alert("Login failed: " + loginResponse.data.error);
                }
            }
        } catch (error) {
            console.error("Error updating password:", error);
        }
    }

    return (
        <Dialog
            open={props.isOpen}
            onOpenChange={props.toggle}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Changer votre mot de passe</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="password"
                                rules={{
                                    required: "Le mot de passe est requis",
                                    minLength: {
                                        value: 8,
                                        message: "Le mot de passe doit contenir au moins 8 caractères"
                                    },
                                    validate: {
                                        hasUpperCase: (value) =>
                                            /[A-Z]/.test(value) || "Le mot de passe doit contenir au moins une majuscule",
                                        hasSpecialChar: (value) =>
                                            /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Le mot de passe doit contenir au moins un caractère spécial"
                                    }
                                }}
                                defaultValue=""
                                render={({ field }) => (
                                    <FormItem aria-required={true}>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                rules={{
                                    required: "Veuillez confirmer le mot de passe",
                                    validate: (value) =>
                                        value === form.watch("password") || "Les mots de passe ne correspondent pas"
                                }}
                                defaultValue=""
                                render={({ field }) => (
                                    <FormItem aria-required={true}>
                                        <FormLabel>Confirmer le mot de passe</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className={"flex gap-4 justify-end"}>
                                <Button onClick={props.toggle}>Annuler</Button>
                                <Button type="submit" color={"required"}>
                                    Changer le mot de passe
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

export default ChangePasswordPopup;