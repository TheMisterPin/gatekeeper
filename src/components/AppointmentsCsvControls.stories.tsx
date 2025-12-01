import type { Meta, StoryObj } from "@storybook/react"
import AppointmentsCsvControls from "./AppointmentsCsvControls"

const meta: Meta<typeof AppointmentsCsvControls> = {
  title: "Components/AppointmentsCsvControls",
  component: AppointmentsCsvControls,
}

export default meta

type Story = StoryObj<typeof AppointmentsCsvControls>

export const Default: Story = {
  args: {
    date: "2025-11-25",
    onImportComplete: () => alert("Import completato"),
  },
  render: (args) => <AppointmentsCsvControls {...args} />,
}
