/**
 * useSyncedStorage Hook
 * 
 * Wraps storage operations with automatic cloud sync.
 * Use this instead of direct storage calls when you want auto-sync.
 */

import { useCallback } from 'react'
import { useSyncContext } from '../components/SyncContext'
import { db } from '../db'

/**
 * Hook that provides storage operations with automatic sync.
 */
export const useSyncedStorage = () => {
    const { syncRecord, deleteRecord, user, isConfigured } = useSyncContext()

    /**
     * Save an order and sync to cloud
     */
    const saveOrderWithSync = useCallback(async (order) => {
        try {
            // Ensure order has updatedAt
            const orderWithTimestamp = {
                ...order,
                updatedAt: new Date().toISOString()
            }

            // Save locally
            await db.orders.put(orderWithTimestamp)

            // Sync to cloud
            if (isConfigured && user) {
                await syncRecord('orders', orderWithTimestamp)
            }

            return true
        } catch (error) {
            console.error('Error saving order with sync:', error)
            return false
        }
    }, [syncRecord, user, isConfigured])

    /**
     * Delete an order and sync deletion to cloud
     */
    const deleteOrderWithSync = useCallback(async (orderId) => {
        try {
            // Delete locally
            await db.orders.delete(orderId)

            // Sync deletion to cloud
            if (isConfigured && user) {
                await deleteRecord('orders', orderId)
            }

            return true
        } catch (error) {
            console.error('Error deleting order with sync:', error)
            return false
        }
    }, [deleteRecord, user, isConfigured])

    /**
     * Save an expense and sync to cloud
     */
    const saveExpenseWithSync = useCallback(async (expense) => {
        try {
            const expenseWithTimestamp = {
                ...expense,
                updatedAt: new Date().toISOString()
            }

            await db.expenses.put(expenseWithTimestamp)

            if (isConfigured && user) {
                await syncRecord('expenses', expenseWithTimestamp)
            }

            return true
        } catch (error) {
            console.error('Error saving expense with sync:', error)
            return false
        }
    }, [syncRecord, user, isConfigured])

    /**
     * Delete an expense and sync deletion to cloud
     */
    const deleteExpenseWithSync = useCallback(async (expenseId) => {
        try {
            await db.expenses.delete(expenseId)

            if (isConfigured && user) {
                await deleteRecord('expenses', expenseId)
            }

            return true
        } catch (error) {
            console.error('Error deleting expense with sync:', error)
            return false
        }
    }, [deleteRecord, user, isConfigured])

    /**
     * Save inventory item and sync to cloud
     */
    const saveInventoryItemWithSync = useCallback(async (item) => {
        try {
            const itemWithTimestamp = {
                ...item,
                updatedAt: new Date().toISOString()
            }

            await db.inventory.put(itemWithTimestamp)

            if (isConfigured && user) {
                await syncRecord('inventory', itemWithTimestamp)
            }

            return true
        } catch (error) {
            console.error('Error saving inventory with sync:', error)
            return false
        }
    }, [syncRecord, user, isConfigured])

    /**
     * Delete inventory item and sync deletion to cloud
     */
    const deleteInventoryItemWithSync = useCallback(async (itemId) => {
        try {
            await db.inventory.delete(itemId)

            if (isConfigured && user) {
                await deleteRecord('inventory', itemId)
            }

            return true
        } catch (error) {
            console.error('Error deleting inventory with sync:', error)
            return false
        }
    }, [deleteRecord, user, isConfigured])

    /**
     * Save products and sync to cloud
     */
    const saveProductsWithSync = useCallback(async (products) => {
        try {
            const productsWithTimestamp = {
                id: 'products',
                data: products,
                updatedAt: new Date().toISOString()
            }

            await db.products.put(productsWithTimestamp)

            if (isConfigured && user) {
                await syncRecord('products', productsWithTimestamp)
            }

            return true
        } catch (error) {
            console.error('Error saving products with sync:', error)
            return false
        }
    }, [syncRecord, user, isConfigured])

    /**
     * Save settings and sync to cloud
     */
    const saveSettingsWithSync = useCallback(async (settingsData) => {
        try {
            const settingsWithTimestamp = {
                id: 'settings',
                data: settingsData,
                updatedAt: new Date().toISOString()
            }

            await db.settings.put(settingsWithTimestamp)

            if (isConfigured && user) {
                await syncRecord('settings', settingsWithTimestamp)
            }

            return true
        } catch (error) {
            console.error('Error saving settings with sync:', error)
            return false
        }
    }, [syncRecord, user, isConfigured])

    /**
     * Save order source and sync to cloud
     */
    const saveOrderSourceWithSync = useCallback(async (source) => {
        try {
            const sourceWithTimestamp = {
                ...source,
                updatedAt: new Date().toISOString()
            }

            await db.orderSources.put(sourceWithTimestamp)

            if (isConfigured && user) {
                await syncRecord('orderSources', sourceWithTimestamp)
            }

            return true
        } catch (error) {
            console.error('Error saving order source with sync:', error)
            return false
        }
    }, [syncRecord, user, isConfigured])

    /**
     * Delete order source and sync deletion to cloud
     */
    const deleteOrderSourceWithSync = useCallback(async (sourceId) => {
        try {
            await db.orderSources.delete(sourceId)

            if (isConfigured && user) {
                await deleteRecord('orderSources', sourceId)
            }

            return true
        } catch (error) {
            console.error('Error deleting order source with sync:', error)
            return false
        }
    }, [deleteRecord, user, isConfigured])

    /**
     * Save tracking numbers and sync to cloud
     */
    const saveTrackingNumberWithSync = useCallback(async (trackingNumber) => {
        try {
            const trackingWithTimestamp = {
                ...trackingNumber,
                updatedAt: new Date().toISOString()
            }

            await db.trackingNumbers.put(trackingWithTimestamp)

            if (isConfigured && user) {
                await syncRecord('trackingNumbers', trackingWithTimestamp)
            }

            return true
        } catch (error) {
            console.error('Error saving tracking number with sync:', error)
            return false
        }
    }, [syncRecord, user, isConfigured])

    return {
        // Orders
        saveOrderWithSync,
        deleteOrderWithSync,

        // Expenses
        saveExpenseWithSync,
        deleteExpenseWithSync,

        // Inventory
        saveInventoryItemWithSync,
        deleteInventoryItemWithSync,

        // Products
        saveProductsWithSync,

        // Settings
        saveSettingsWithSync,

        // Order Sources
        saveOrderSourceWithSync,
        deleteOrderSourceWithSync,

        // Tracking Numbers
        saveTrackingNumberWithSync,

        // Sync status
        isSyncEnabled: isConfigured && !!user
    }
}

export default useSyncedStorage
