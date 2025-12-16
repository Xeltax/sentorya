import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {EyeIcon, Pen, Trash, UserMinus, UserPlus} from "lucide-react";
import {useState} from "react";
import addMemberDialog from "@/components/Popup/AddMemberDialog/AddMemberDialog";
import AddMemberDialog from "@/components/Popup/AddMemberDialog/AddMemberDialog";
import {OrganizationsWithMembers} from "@/types/OrganizationsWithMembers";
import {User} from "@/types/User";
import DeleteMemberDialog from "@/components/Popup/DeleteMemberDialog/DeleteMemberDialog";
import ConfirmationDialog from "@/components/Popup/ConfirmationPopup/ConfirmationDialog";
import EditOrganizationDialog from "@/components/Popup/EditOrganizationDialog/EditOrganizationDialog";
import {useOrganizations} from "@/components/context/OrganizationContext";
import Client from "@/utils/client";
import {ROUTES} from "@/utils/routes";

const OrganizationActionDatable = (props : {organizations : OrganizationsWithMembers, users : User[]}) => {
    const { updateOrganization, deleteOrganization, addMember, removeMember } = useOrganizations();
    const [openAddMemberDialog, setAddMemberDialog] = useState<boolean>(false);
    const [openDeleteMemberDialog, setOpenDeleteMemberDialog] = useState<boolean>(false);
    const [openEditOrganizationDialog, setOpenEditOrganizationDialog] = useState<boolean>(false);
    const [openDeleteOrganizationDialog, setOpenDeleteOrganizationDialog] = useState<boolean>(false);

    const handleDeleteOrganization = () => {
        Client.delete(`${ROUTES.BACK.ORGANIZATION.CRUD}/${props.organizations.id}`).then(() => {
            deleteOrganization(props.organizations.id);
        })
    }

    return (
        <div className={"flex items-center gap-2"}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setAddMemberDialog(true)}>
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
                        <UserMinus className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Supprimer un membre</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild onClick={() => {}}>
                    <Button variant="outline" className="h-8 w-8 p-0">
                        <EyeIcon className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Voir l&apos;entreprise</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild onClick={() => setOpenEditOrganizationDialog(true)}>
                    <Button variant="secondary" className="h-8 w-8 p-0">
                        <span className="sr-only">Voir</span>
                        <Pen className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Modifier l&apos;entreprise</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild onClick={() => setOpenDeleteOrganizationDialog(true)}>
                    <Button variant="destructive" className="h-8 w-8 p-0">
                        <span className="sr-only">Voir</span>
                        <Trash className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Supprimer l&apos;entreprise</p>
                </TooltipContent>
            </Tooltip>

            {openAddMemberDialog &&
                <AddMemberDialog isOpen={openAddMemberDialog} toggle={() => setAddMemberDialog(!addMemberDialog)} organization={props.organizations} users={props.users}/>
            }

            {openDeleteMemberDialog &&
                <DeleteMemberDialog isOpen={openDeleteMemberDialog} toggle={() => setOpenDeleteMemberDialog(!openDeleteMemberDialog)} organization={props.organizations} users={props.users}/>
            }

            {openEditOrganizationDialog &&
                <EditOrganizationDialog isOpen={openEditOrganizationDialog} toggle={() => setOpenEditOrganizationDialog(!openEditOrganizationDialog)} organization={props.organizations} callback={(data) => updateOrganization(props.organizations.id, data)}/>
            }

            {openDeleteOrganizationDialog &&
                <ConfirmationDialog
                    isOpen={openDeleteOrganizationDialog}
                    toggle={() => setOpenDeleteOrganizationDialog(!openDeleteOrganizationDialog)}
                    message={"Êtes vous sur de vouloir supprimer l'entreprise cette action est irréversible !"}
                    onConfirm={handleDeleteOrganization}
                />
            }
        </div>
    )
}

export default OrganizationActionDatable;