import { useEffect, useCallback } from 'react'

/**
 * Custom hook for handling keyboard shortcuts throughout the application.
 * 
 * Shortcuts:
 * - Ctrl+N: New Order
 * - Ctrl+Shift+N: New Expense
 * - Enter: Submit (context-dependent)
 * - Escape: Close modal
 * - /: Focus search
 * 
 * Page Navigation:
 * - Ctrl+O: Orders
 * - Ctrl+I: Inventory
 * - Ctrl+E: Expenses
 * - Ctrl+Q: Quotations
 * - Ctrl+R: Reports
 * - Ctrl+F: Profile (disabled - conflicts with browser find)
 * - Ctrl+,: Settings
 * - Ctrl+Shift+A: Appearance
 * - Ctrl+Shift+S: Contact Support
 * - F1: Help & Docs
 */

const useKeyboardShortcuts = (options = {}) => {
    const {
        onNewOrder,
        onNewExpense,
        onNavigate,
        onCloseModal,
        onFocusSearch,
        onSubmit,
        enabled = true
    } = options

    const handleKeyDown = useCallback((event) => {
        if (!enabled) return

        // Don't trigger shortcuts when typing in input fields (except for specific keys)
        const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
        const isContentEditable = document.activeElement?.isContentEditable

        // Always allow Escape to close modals
        if (event.key === 'Escape') {
            event.preventDefault()
            onCloseModal?.()
            return
        }

        // Don't trigger other shortcuts when typing
        if (isInputFocused || isContentEditable) {
            // Allow Enter to submit forms when in input
            if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.altKey) {
                // Let the form handle Enter naturally
                return
            }
            return
        }

        const { key, ctrlKey, shiftKey, altKey, metaKey } = event
        const modKey = ctrlKey || metaKey // Support both Ctrl (Windows/Linux) and Cmd (Mac)

        // F1: Help & Docs
        if (key === 'F1') {
            event.preventDefault()
            onNavigate?.('help')
            return
        }

        // / : Focus search
        if (key === '/' && !modKey && !shiftKey && !altKey) {
            event.preventDefault()
            onFocusSearch?.()
            return
        }

        // Ctrl/Cmd + key combinations
        if (modKey) {
            // Ctrl+Shift combinations
            if (shiftKey) {
                switch (key.toUpperCase()) {
                    case 'N':
                        event.preventDefault()
                        onNewExpense?.()
                        break
                    case 'A':
                        event.preventDefault()
                        onNavigate?.('appearance')
                        break
                    case 'S':
                        event.preventDefault()
                        onNavigate?.('support')
                        break
                    default:
                        break
                }
                return
            }

            // Ctrl only combinations
            switch (key.toUpperCase()) {
                case 'N':
                    event.preventDefault()
                    onNewOrder?.()
                    break
                case 'O':
                    event.preventDefault()
                    onNavigate?.('orders')
                    break
                case 'I':
                    event.preventDefault()
                    onNavigate?.('inventory')
                    break
                case 'E':
                    event.preventDefault()
                    onNavigate?.('expenses')
                    break
                case 'Q':
                    event.preventDefault()
                    onNavigate?.('quotations')
                    break
                case 'R':
                    event.preventDefault()
                    onNavigate?.('reports')
                    break
                case ',':
                    event.preventDefault()
                    onNavigate?.('settings')
                    break
                // Note: Ctrl+F is intentionally not overridden to preserve browser find functionality
                default:
                    break
            }
        }
    }, [enabled, onNewOrder, onNewExpense, onNavigate, onCloseModal, onFocusSearch])

    useEffect(() => {
        if (enabled) {
            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
        }
    }, [enabled, handleKeyDown])

    return null
}

// Shortcut definitions for display purposes
export const SHORTCUTS = {
    actions: [
        { keys: ['Ctrl', 'N'], description: 'New Order' },
        { keys: ['Ctrl', 'Shift', 'N'], description: 'New Expense' },
        { keys: ['Enter'], description: 'Submit form' },
        { keys: ['Esc'], description: 'Close modal' },
        { keys: ['/'], description: 'Focus search' }
    ],
    navigation: [
        { keys: ['Ctrl', 'O'], description: 'Go to Orders' },
        { keys: ['Ctrl', 'I'], description: 'Go to Inventory' },
        { keys: ['Ctrl', 'E'], description: 'Go to Expenses' },
        { keys: ['Ctrl', 'Q'], description: 'Go to Quotations' },
        { keys: ['Ctrl', 'R'], description: 'Go to Reports' },
        { keys: ['Ctrl', ','], description: 'Open Settings' },
        { keys: ['Ctrl', 'Shift', 'A'], description: 'Appearance Settings' },
        { keys: ['Ctrl', 'Shift', 'S'], description: 'Contact Support' },
        { keys: ['F1'], description: 'Help & Documentation' }
    ]
}

export default useKeyboardShortcuts
