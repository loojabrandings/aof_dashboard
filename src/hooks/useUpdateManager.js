import { useState, useEffect, useCallback } from 'react'

/**
 * useUpdateManager
 * 
 * High-level hook to manage software updates across platforms.
 * Bridges Electron IPC and Capacitor logic.
 */
export const useUpdateManager = () => {
    const [status, setStatus] = useState('idle') // 'idle', 'checking', 'available', 'downloading', 'ready', 'none'
    const [progress, setProgress] = useState(0)
    const [updateInfo, setUpdateInfo] = useState(null)
    const [error, setError] = useState(null)
    const [autoUpdate, setAutoUpdate] = useState(() => {
        const saved = localStorage.getItem('aof_auto_update')
        return saved === null ? true : saved === 'true'
    })

    const isElectron = !!window.electronAPI

    // Persist autoUpdate setting
    useEffect(() => {
        localStorage.setItem('aof_auto_update', autoUpdate)
    }, [autoUpdate])

    /**
     * Handle Update Status from Electron
     */
    useEffect(() => {
        if (isElectron && window.electronAPI.onUpdateStatus) {
            window.electronAPI.onUpdateStatus((data) => {
                const { type, info, message, error: updateError, percent } = data

                switch (type) {
                    case 'checking':
                        setStatus('checking')
                        break
                    case 'available':
                        setStatus('available')
                        setUpdateInfo(info)
                        // If auto-update is on, start download immediately
                        if (autoUpdate) {
                            window.electronAPI.startDownload()
                        }
                        break
                    case 'not-available':
                        setStatus('none')
                        break
                    case 'downloading':
                        setStatus('downloading')
                        setProgress(percent || 0)
                        break
                    case 'downloaded':
                        setStatus('ready')
                        setProgress(100)
                        break
                    case 'error':
                        setStatus('idle')
                        setError(updateError || message)
                        break
                    default:
                        break
                }
            })
        }
    }, [isElectron, autoUpdate])

    /**
     * Actions
     */
    const checkForUpdates = useCallback(async () => {
        setError(null)
        if (isElectron) {
            setStatus('checking')
            try {
                await window.electronAPI.checkForUpdates()
            } catch (err) {
                setError('Failed to check for updates: ' + err.message)
                setStatus('idle')
            }
        } else {
            // Capacitor logic would go here
            setStatus('checking')
            setTimeout(() => setStatus('none'), 1500) // Mock
        }
    }, [isElectron])

    const startDownload = useCallback(async () => {
        if (isElectron) {
            await window.electronAPI.startDownload()
        }
    }, [isElectron])

    const installUpdate = useCallback(async () => {
        if (isElectron) {
            await window.electronAPI.installUpdate()
        }
    }, [isElectron])

    // Auto-check on launch (once)
    useEffect(() => {
        checkForUpdates()
    }, [])

    return {
        status,
        progress,
        updateInfo,
        error,
        autoUpdate,
        setAutoUpdate,
        checkForUpdates,
        startDownload,
        installUpdate
    }
}
