import type { Meta, StoryObj } from "@storybook/react"
import CheckInPage from "./page"

const meta: Meta<typeof CheckInPage> = {
  title: "Pages/CheckIn",
  component: CheckInPage,
  parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CheckInPage>

export const Default: Story = {
  render: () => {
    if (typeof window !== "undefined") {
      window.fetch = async () => ({
        ok: true,
        json: async () => ({
          appointments: [
            {
              id: 1,
              visitorName: "Ospite Demo",
              hostName: "Responsabile", 
              startTime: "2025-11-25T09:00:00Z",
            },
          ],
        }),
      }) as any
    }
    return <CheckInPage />
  },
}
