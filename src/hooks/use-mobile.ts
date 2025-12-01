import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(): boolean {
  // initialize from window if available to avoid initial undefined/flicker
  const getInitial = () => {
    if (typeof window === "undefined") return false
    return window.innerWidth < MOBILE_BREAKPOINT
  }

  const [isMobile, setIsMobile] = React.useState<boolean>(getInitial)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // set initial according to current window size (in case it changed before effect)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    }

    // fallback for older browsers
    if (mql.addListener) {
      // @ts-expect-error - older API
      mql.addListener(onChange)
      return () => {
        // @ts-ignore
        mql.removeListener(onChange)
      }
    }

    return undefined
  }, [])

  return isMobile
}
