import type { Meta, StoryObj } from "@storybook/react"
import { AppHeaderComponent } from "./app-header"

const meta: Meta<typeof AppHeaderComponent> = {
  title: "Components/AppHeader",
  component: AppHeaderComponent,
}

export default meta

type Story = StoryObj<typeof AppHeaderComponent>

export const WithLogo: Story = {
  args: {
    logo: <span className="font-semibold">Gatekeeper</span>,
    onToggleSidebar: () => alert("toggle sidebar"),
  },
}

export const WithoutToggle: Story = {
  args: {
    logo: <span className="font-semibold">Gatekeeper</span>,
  },
}
