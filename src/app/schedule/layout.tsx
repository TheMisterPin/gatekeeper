import type { ReactNode } from "react"
import { ScheduleProvider } from "@/hooks/useScheduleController"

export default function ScheduleLayout({ children }: { children: ReactNode }) {
	return <ScheduleProvider>{children}</ScheduleProvider>
}
