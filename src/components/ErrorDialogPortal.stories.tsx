import type { Meta, StoryObj } from "@storybook/react"
import ErrorDialogPortal from "./ErrorDialogPortal"
import { ErrorDialogProvider, useErrorDialog } from "../hooks/ErrorDialogContext"

const meta: Meta<typeof ErrorDialogPortal> = {
  title: "Components/ErrorDialogPortal",
  component: ErrorDialogPortal,
  decorators: [
    (Story) => (
      <ErrorDialogProvider>
        <Story />
      </ErrorDialogProvider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof ErrorDialogPortal>

const DemoTrigger = () => {
  const { reportError } = useErrorDialog()
  return (
    <button
      type="button"
      className="rounded bg-red-600 px-3 py-2 text-white"
      onClick={() =>
        reportError("Impossibile completare la richiesta", {
          title: "Errore di esempio",
          source: "storybook",
          severity: "warning",
          details: "Stacktrace o messaggio tecnico" as string,
        })
      }
    >
      Mostra dialogo
    </button>
  )
}

export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Premi il pulsante per aprire il dialog di errore globale.
      </p>
      <DemoTrigger />
      <ErrorDialogPortal />
    </div>
  ),
}
