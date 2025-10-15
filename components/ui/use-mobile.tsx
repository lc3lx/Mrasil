import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    const useAddEvent = typeof (mql as any).addEventListener === 'function'
    if (useAddEvent) {
      (mql as any).addEventListener("change", onChange)
    } else {
      (mql as any).addListener(onChange)
    }
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => {
      if (useAddEvent) {
        (mql as any).removeEventListener("change", onChange)
      } else {
        (mql as any).removeListener(onChange)
      }
    }
  }, [])

  return !!isMobile
}
