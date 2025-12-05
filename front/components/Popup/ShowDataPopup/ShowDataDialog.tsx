import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/ui/components/dialog";

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
                <DialogBody>
                    <pre className="max-h-96 overflow-auto">{props.data}</pre>
                </DialogBody>
                <DialogFooter>
                    <Button onClick={props.toggle}>Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ShowDataDialog;