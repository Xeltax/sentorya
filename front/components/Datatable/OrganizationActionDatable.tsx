import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {UserMinus, UserPlus} from "lucide-react";
import {useState} from "react";
import addMemberDialog from "@/components/Popup/AddMemberDialog/AddMemberDialog";
import AddMemberDialog from "@/components/Popup/AddMemberDialog/AddMemberDialog";
import {OrganizationsWithMembers} from "@/types/OrganizationsWithMembers";
import {User} from "@/types/User";
import DeleteMemberDialog from "@/components/Popup/DeleteMemberDialog/DeleteMemberDialog";

const OrganizationActionDatable = (props : {organizations : OrganizationsWithMembers, users : User[]}) => {
    const [openAddMemberDialog, setAddMemberDialog] = useState<boolean>(false);
    const [openDeleteMemberDialog, setOpenDeleteMemberDialog] = useState<boolean>(false);

    console.log(openAddMemberDialog)

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setAddMemberDialog(true)}>
                        <span className="sr-only">Voir</span>
                        <UserPlus className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Ajouter un membre</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setOpenDeleteMemberDialog(true)}>
                        <span className="sr-only">Voir</span>
                        <UserMinus className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Supprimer un membre</p>
                </TooltipContent>
            </Tooltip>

            {openAddMemberDialog &&
                <AddMemberDialog isOpen={openAddMemberDialog} toggle={() => setAddMemberDialog(!addMemberDialog)} organization={props.organizations} users={props.users}/>
            }

            {openDeleteMemberDialog &&
                <DeleteMemberDialog isOpen={openDeleteMemberDialog} toggle={() => setOpenDeleteMemberDialog(!openDeleteMemberDialog)} organization={props.organizations} users={props.users}/>
            }
        </>
    )
}

export default OrganizationActionDatable;