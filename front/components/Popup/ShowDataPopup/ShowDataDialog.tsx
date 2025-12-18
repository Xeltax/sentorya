import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

const ShowDataDialog = (props : { isOpen: boolean, toggle : () => void, title : string, data: string }) => {
    return (
        <Dialog
            open={props.isOpen}
            onOpenChange={props.toggle}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{props.title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <pre className="max-h-96 overflow-auto">{props.data}</pre>
                </DialogDescription>
                <DialogFooter>
                    <Button onClick={props.toggle}>Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ShowDataDialog;