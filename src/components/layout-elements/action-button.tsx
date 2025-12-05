 
"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ButtonType, ButtonAction, type ButtonIcon } from "@/types/button-enums"
import * as LucideIcons from "lucide-react"

interface UniversalButtonProps {
  type: ButtonType
  action: ButtonAction
  icon: ButtonIcon
  tooltip: string
  onClick: () => void
  disabled?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function UniversalButton({
  type,
  action,
  icon,
  tooltip,
  onClick,
  disabled = false,
  variant = "default",
  size = "default",
  className = "",
}: UniversalButtonProps) {
  // Get the icon component from Lucide
  const IconComponent = (LucideIcons as any)[icon]

  const getActionLabel = (action: ButtonAction): string => {
    return action.charAt(0).toUpperCase() + action.slice(1).replace("_", " ")
  }

  const getVariantForAction = (action: ButtonAction) => {
    switch (action) {
      case ButtonAction.DELETE:
      case ButtonAction.CANCEL:
        return "destructive"
      case ButtonAction.EDIT:
      case ButtonAction.VIEW:
        return "outline"
      case ButtonAction.SAVE:
      case ButtonAction.CONFIRM:
      case ButtonAction.SUBMIT:
        return "default"
      default:
        return variant
    }
  }

  const buttonVariant = getVariantForAction(action)
  const buttonSize = type === ButtonType.ICON ? "icon" : size

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={buttonVariant} size={buttonSize} onClick={onClick} disabled={disabled} className={className}>
            {IconComponent && <IconComponent className="h-4 w-4" />}
            {type === ButtonType.FULL && <span className="ml-2">{getActionLabel(action)}</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
