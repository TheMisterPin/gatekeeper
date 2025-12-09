import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import ModalSelector from "./modal-selector"
import { Icon, LucideIcon } from "lucide-react"
interface Props {
  onConfirm?: () => void,
  triggerText: string
  modalToOpen: string,
   icon? : LucideIcon;
   message: string;
}
export function ConfirmModalComponent({ onConfirm, triggerText, modalToOpen, icon, message }: Props) {
  const IconComponent = icon;
    
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" >{IconComponent && <IconComponent />} {triggerText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-2 border-red-500 p-0">
    <ModalSelector modal={modalToOpen} onConfirm={onConfirm ?? (() => {console.log("No confirm action provided")})}  message={message} />
      </AlertDialogContent>
    </AlertDialog>
  )
}
