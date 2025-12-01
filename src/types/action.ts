import { LucideIcon } from "lucide-react";

export interface Action {
    icon : LucideIcon;
    tooltip: string;
    actionPerformed: () => void;
}