import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

const ConfirmUserCreateDialog = (props : {isOpen :boolean, toggle : () => void, handleConfirm : () => void}) => {
    return (
        <Dialog
            open={props.isOpen}
            onOpenChange={(open) => props.toggle()}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Créer un compte administrateur ?</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir créer un compte administrateur ?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => {props.toggle()}}>
                        Annuler
                    </Button>
                    <Button variant="secondary" onClick={() => createUser(formData!)}>
                        Confirmer la création
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmUserCreateDialog;