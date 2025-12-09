import type { Meta, StoryObj } from "@storybook/react"
import AppShell from "./app-shell"

const meta: Meta<typeof AppShell> = {
  title: "Components/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="min-h-screen">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof AppShell>

export const Default: Story = {
  args: {
    logo: <div className="font-bold">Gatekeeper</div>,
    currentUserName: "Mario Rossi",
    onLogout: () => console.log("Logout"),
    children: (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Contenuto principale</h1>
        <p className="text-sm text-slate-600">
          Questo layout mostra header fisso, sidebar e footer di sessione.
        </p>
      </div>
    ),
  },
  render: (args) => (
    <AppShell {...args} />
  ),
}
