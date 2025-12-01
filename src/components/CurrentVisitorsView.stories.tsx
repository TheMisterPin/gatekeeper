import type { Meta, StoryObj } from "@storybook/react"
import CurrentVisitorsView from "./CurrentVisitorsView"

const meta: Meta<typeof CurrentVisitorsView> = {
  title: "Components/CurrentVisitorsView",
  component: CurrentVisitorsView,
}

export default meta

type Story = StoryObj<typeof CurrentVisitorsView>

export const EmptyState: Story = {
  args: {
    visits: [],
  },
}

export const WithVisitors: Story = {
  args: {
    visits: [
      {
        id: 1,
        visitorName: "Giulia Bianchi",
        hostName: "Luca Rossi",
        checkInTime: "2025-11-25T09:30:00Z",
        location: "Sala Nord",
      },
      {
        id: 2,
        visitorName: "Marco Verdi",
        hostName: "Sara Neri",
        checkInTime: "2025-11-25T08:50:00Z",
      },
    ],
  },
}

export const LoadingWithRefresh: Story = {
  args: {
    visits: [
      {
        id: 1,
        visitorName: "Visitatore in aggiornamento",
        hostName: "Host",
        checkInTime: "2025-11-25T10:00:00Z",
      },
    ],
    loading: true,
    onRefresh: () => alert("aggiorna"),
  },
}
