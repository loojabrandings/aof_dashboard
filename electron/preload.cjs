/**
 * Electron Preload Script
 * 
 * Exposes secure APIs from the main process to the renderer.
 */

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    /**
     * Setup the Supabase database tables automatically.
     * @param {string} connectionString - The Postgres connection string from Supabase.
     * @returns {Promise<{success: boolean, message?: string, error?: string}>}
     */
    setupDatabase: (connectionString) => {
        return ipcRenderer.invoke('setup-database', connectionString)
    },

    /**
     * Test the database connection.
     * @param {string} connectionString - The Postgres connection string.
     * @returns {Promise<{success: boolean, serverTime?: string, error?: string}>}
     */
    testConnection: (connectionString) => {
        return ipcRenderer.invoke('test-database-connection', connectionString)
    },

    /**
     * Open a URL in the user's default browser.
     * @param {string} url - The URL to open.
     */
    openExternal: (url) => {
        return ipcRenderer.invoke('open-external', url)
    },

    /**
     * Listen for authentication callbacks (from deep links).
     * @param {Function} callback - Function to handle the URL.
     */
    onAuthCallback: (callback) => {
        ipcRenderer.on('auth-callback', (event, url) => callback(url))
    },

    /**
     * Check for software updates via Electron.
     */
    checkForUpdates: () => {
        return ipcRenderer.invoke('check-for-updates')
    },

    /**
     * Start downloading the available update.
     */
    startDownload: () => {
        return ipcRenderer.invoke('start-download')
    },

    /**
     * Quit the app and install the downloaded update.
     */
    installUpdate: () => {
        return ipcRenderer.invoke('install-update')
    },

    /**
     * Listen for update status messages from the main process.
     */
    onUpdateStatus: (callback) => {
        ipcRenderer.on('update-status', (event, data) => callback(data))
    },

    /**
     * Platform identifier.
     */
    platform: 'electron'
})

