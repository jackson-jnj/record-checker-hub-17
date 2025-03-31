
import * as React from "react"
import { debug } from "@/utils/debugUtils"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      debug.log("useMobile", `Device is ${mobile ? "mobile" : "desktop"}`, { width: window.innerWidth })
    }
    
    mql.addEventListener("change", onChange)
    onChange() // Set initial value
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      const tablet = window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT
      setIsTablet(tablet)
      debug.log("useTablet", `Device is ${tablet ? "tablet" : "not tablet"}`, { width: window.innerWidth })
    }
    
    mql.addEventListener("change", onChange)
    onChange() // Set initial value
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isTablet
}

export function useDeviceType() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  
  if (isMobile) return "mobile"
  if (isTablet) return "tablet"
  return "desktop"
}
