import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TriangleAlert } from "lucide-react"

  
export function ConfirmModal({ onConfirm, message }: { onConfirm: () => void, message: string }) {
  return (

      <>
      
        <AlertDialogHeader className="overflow-hidden rounded-t-lg">
          <AlertDialogTitle className="bg-warning py-3"> 
            <div className="w-1/2 flex justify-between items-center mx-auto text-red-200">
            <TriangleAlert className="inline-block mr-2" />
            ATTENZIONE
            <TriangleAlert className="inline-block mr-2" />
            </div>
            </AlertDialogTitle>
          <AlertDialogDescription className="px-6 py-4 text-center ">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </>

  )
}
