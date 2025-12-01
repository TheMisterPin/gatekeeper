"use client"

import { useCallback, useState } from "react"

interface UseConsentOptions {
  onBiometricConsentDisabled?: () => void
}

interface UseConsentResult {
  mainConsentChecked: boolean
  biometricConsentChecked: boolean
  setMainConsentChecked: (checked: boolean) => void
  setBiometricConsentChecked: (checked: boolean) => void
  resetConsents: () => void
}

export function useConsent(options?: UseConsentOptions): UseConsentResult {
  const [mainConsentChecked, setMainConsentCheckedState] = useState(false)
  const [biometricConsentChecked, setBiometricConsentCheckedState] = useState(false)

  const setMainConsentChecked = useCallback((checked: boolean) => {
    setMainConsentCheckedState(checked)
  }, [])

  const setBiometricConsentChecked = useCallback(
    (checked: boolean) => {
      setBiometricConsentCheckedState((previous) => {
        if (previous && !checked) {
          options?.onBiometricConsentDisabled?.()
        }
        return checked
      })
    },
    [options],
  )

  const resetConsents = useCallback(() => {
    setMainConsentCheckedState(false)
    setBiometricConsentCheckedState((previous) => {
      if (previous) {
        options?.onBiometricConsentDisabled?.()
      }
      return false
    })
  }, [options])

  return {
    mainConsentChecked,
    biometricConsentChecked,
    setMainConsentChecked,
    setBiometricConsentChecked,
    resetConsents,
  }
}
