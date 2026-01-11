/**
 * Platform Detection Hook
 * 
 * Detects the current runtime environment (Electron, Capacitor, or Web).
 */

import { useState, useEffect } from 'react'

/**
 * Detect the current platform.
 */
export const detectPlatform = () => {
    // Check for Electron
    const isElectron = !!(
        typeof window !== 'undefined' &&
        window.electronAPI
    )

    // Check for Capacitor
    const isCapacitor = !!(
        typeof window !== 'undefined' &&
        window.Capacitor &&
        window.Capacitor.isNativePlatform &&
        window.Capacitor.isNativePlatform()
    )

    // Web is the fallback
    const isWeb = !isElectron && !isCapacitor

    return {
        isElectron,
        isCapacitor,
        isWeb,
        isDesktop: isElectron,
        isMobile: isCapacitor,
        platform: isElectron ? 'electron' : isCapacitor ? 'capacitor' : 'web'
    }
}

/**
 * React hook for platform detection.
 */
export const usePlatform = () => {
    const [platform, setPlatform] = useState(() => detectPlatform())

    useEffect(() => {
        // Re-detect on mount (in case detection runs before APIs are available)
        setPlatform(detectPlatform())
    }, [])

    return platform
}

/**
 * Check if automated database setup is available.
 * Only available on Electron where we have access to the pg library via IPC.
 */
export const canAutoSetupDatabase = () => {
    const { isElectron } = detectPlatform()
    return isElectron && typeof window.electronAPI?.setupDatabase === 'function'
}

export default usePlatform
