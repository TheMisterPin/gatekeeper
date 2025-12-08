import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import ModalSelector from "./modal-selector"
import { Icon } from "lucide-react"
interface Props {
  onConfirm?: () => void,
  triggerText: string
  modalToOpen: string
}
export function ConfirmModalComponent({ onConfirm, triggerText, modalToOpen }: Props) {
    
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" >{triggerText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
    <ModalSelector modal={modalToOpen} onConfirm={onConfirm ?? (() => {console.log("No confirm action provided")})} />
      </AlertDialogContent>
    </AlertDialog>
  )
}
