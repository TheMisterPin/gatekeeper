import type { Meta, StoryObj } from "@storybook/react"
import LoginWrapper from "./components/login-form-wrapper"
import { LoginForm } from "./components/login-form"

const meta: Meta = {
  title: "Pages/Login",
}

export default meta

export const Default: StoryObj = {
  render: () => (
    <LoginWrapper>
      <LoginForm />
    </LoginWrapper>
  ),
}
