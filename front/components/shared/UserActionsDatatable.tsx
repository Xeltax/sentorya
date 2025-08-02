import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {Eye, Pen, Trash} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useState } from "react";
import {User} from "@/types/User";
import {useForm} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../ui/form";
import {Input} from "@/components/ui/input";

const UserActionsDatatable = (props: {data : User}) => {
    console.log("UserActionsDatatable props:", props.data);
    const [openDialog, setOpenDialog] = useState("");
    const form = useForm()

    return (
            <div className={"flex items-center gap-2"}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setOpenDialog("ViewUser")}>
                            <span className="sr-only"></span>
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
                            <span className="sr-only"></span>
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
                            <span className="sr-only"></span>
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
                                <DialogTitle>{props.data.email}</DialogTitle>
                                <DialogDescription asChild>
                                    <div>
                                        Information de l&apos;utilisateur:
                                        <p><strong>Name:</strong> {props.data.name}</p>
                                        <p><strong>Role:</strong> {props.data.role}</p>
                                        <p><strong>Created At:</strong> {new Date(props.data.createdAt).toLocaleString()}</p>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    )}
                    { openDialog === "EditUser" && (
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Modification de {props.data.email}</DialogTitle>
                                <DialogDescription asChild>
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <>
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="shadcn" {...field} />
                                                    </FormControl>
                                                    <FormDescription>This is your public display name.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                                <FormItem>
                                                    <FormLabel>Nom</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="shadcn" {...field} />
                                                    </FormControl>
                                                    <FormDescription>This is your public display name.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                                <FormItem>
                                                    <FormLabel>Role</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="shadcn" {...field} />
                                                    </FormControl>
                                                    <FormDescription>This is your public display name.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            </>
                                        )}
                                    />
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    )}
                    { openDialog === "DeleteUser" && (
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete User</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this user? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    )}
                </Dialog>
            </div>
        )
}

export default UserActionsDatatable