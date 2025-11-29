import { useCallback, useState } from "react"

import { LoginFormValues } from "@/types/login/login-form-values"

export function useLoginForm() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUserName, setCurrentUserName] = useState<string | undefined>()
  const [serverIp, setServerIp] = useState<string | null>(null)
  const [deviceName, setDeviceName] = useState<string | null>(null)
  const [loginSubmitting, setLoginSubmitting] = useState(false)

  const handleLoginSubmit = useCallback(async (values: LoginFormValues) => {
    setLoginSubmitting(true)
    try {
      // Mock the fetch call for now
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

      // Mock successful response
      setIsAuthenticated(true)
      setCurrentUserName(values.resourceName)
      setServerIp(values.serverIp)
      setDeviceName(values.deviceName)
    } catch (err) {
      console.error("Login failed", err)
      window.alert(
        "Impossibile connettersi al server specificato. Verifica IP e connettività."
      )
    } finally {
      setLoginSubmitting(false)
    }
  }, [])

  const resetLoginState = useCallback(() => {
    setIsAuthenticated(false)
    setCurrentUserName(undefined)
    setServerIp(null)
    setDeviceName(null)
  }, [])

  return {
    isAuthenticated,
    currentUserName,
    serverIp,
    deviceName,
    loginSubmitting,
    handleLoginSubmit,
    resetLoginState,
  }
}
