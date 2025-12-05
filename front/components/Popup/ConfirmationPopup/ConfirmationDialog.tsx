import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/ui/components/dialog";
import {Button} from "@/components/ui/button";

const ConfirmationDialog = (props : { isOpen: boolean, toggle : () => void, message: string; onConfirm: () => void }) => {
    return (
        <Dialog
            open={props.isOpen}
            onOpenChange={props.toggle}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmation</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <p>{props.message}</p>
                </DialogBody>
                <DialogFooter>
                    <Button onClick={props.toggle}>Annuler</Button>
                    <Button variant={"destructive"} onClick={() => {
                        props.onConfirm();
                        props.toggle();
                    }}>Confirmer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmationDialog;