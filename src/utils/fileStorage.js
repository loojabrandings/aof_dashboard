
/**
 * Local File Storage (IndexedDB/Base64)
 * 
 * Instead of uploading to Supabase, we convert images to optimized Base64 strings.
 * These strings are stored directly in the `order` object in the `db.orders` table.
 * 
 * PROS:
 * - Fully offline capable.
 * - Zero external dependencies.
 * - Implementation simplicity (no need to manage separate file IDs vs URLs in UI).
 * 
 * CONS:
 * - Increases database size.
 * - `getOrders()` loads all data (including images), which can be heavy.
 * 
 * OPTIMIZATION:
 * - We resize images to max 800px and compress to JPEG 0.5 quality.
 * - This reduces a 5MB file to ~50-80KB.
 * - 1000 orders with images = ~80MB, which is manageable for IndexedDB.
 */

/**
 * Uploads an image for a specific order item.
 * Actually processes the file and returns a Base64 string.
 * 
 * @param {File} file - The file object to upload.
 * @param {string} orderId - The ID of the order (unused, kept for signature compatibility).
 * @param {string} itemId - The ID of the item (unused, kept for signature compatibility).
 * @returns {Promise<string|null>} - The Base64 string of the processed image, or null on error.
 */
export const uploadOrderItemImage = async (file, orderId, itemId) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null)
            return
        }

        // Validate type
        if (!file.type.startsWith('image/')) {
            console.error('File is not an image')
            resolve(null)
            return
        }

        const reader = new FileReader()

        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
                // Resize logic
                const MAX_WIDTH = 800
                const MAX_HEIGHT = 800
                let width = img.width
                let height = img.height

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width
                        width = MAX_WIDTH
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height
                        height = MAX_HEIGHT
                    }
                }

                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)

                // Compress to JPEG 0.5 for storage optimization
                const dataUrl = canvas.toDataURL('image/jpeg', 0.5)
                resolve(dataUrl)
            }
            img.onerror = (err) => {
                console.error('Error loading image for resizing:', err)
                // Fallback to original if resize fails
                resolve(e.target.result)
            }
            img.src = e.target.result
        }

        reader.onerror = (error) => {
            console.error('Error reading file:', error)
            resolve(null)
        }

        reader.readAsDataURL(file)
    })
}

/**
 * Deletes an image from storage.
 * Since images are embedded in the order object, "deleting" is handled by the caller 
 * removing the reference from the order and saving the order.
 * This function is kept for API compatibility.
 * 
 * @param {string} imageUrl - The URL (Base64 string) of the image.
 * @returns {Promise<boolean>} - True.
 */
export const deleteOrderItemImage = async (imageUrl) => {
    // No-op for embedded images.
    // The calling code (OrderForm) removes the string from the order object.
    return true
}
