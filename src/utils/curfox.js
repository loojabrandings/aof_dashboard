export const curfoxService = {
    // Base URL for Curfox API (typically proxied or direct if CORS allows)
    // Using a placeholder or the likely public API endpoint
    baseUrl: 'https://curfox.com/api/public/merchant',

    // Helpers
    getHeaders: (token) => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }),

    // 1. Authentication
    login: async (email, password, tenant) => {
        try {
            // Typically: POST /login or /auth
            // Based on common structures. Adjusting to search result clues:
            // "Merchant API includes endpoints... user-related details (login)"
            // We'll try a standard structure, but this might need adjustment if actual endpoint differs.
            const response = await fetch(`https://${tenant}.curfox.com/api/public/merchant/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            if (!response.ok) {
                throw new Error('Login failed')
            }

            const data = await response.json()
            // data.token or data.access_token
            return data.token || data.access_token
        } catch (error) {
            console.error('Curfox Login Error:', error)
            return null
        }
    },

    // 2. Location Services
    getDistricts: async () => {
        // This might be a public endpoint or require auth. Assuming public/static or auth.
        // However, often these are static constants in the app to avoid extra calls, 
        // but the requirement is to use Curfox's list.
        // We'll simulate fetching or return a mapped list if API fails.
        try {
            // NOTE: real endpoint might be /settings/locations or similar
            // For now, return a promise that resolves to a consistent list, 
            // or try to fetch if we had a specific URL.
            // Returning null to indicate "not implemented yet" or "use fallback" 
            // isn't great. Let's try to structure it for future real API usage.
            return []
        } catch (error) {
            return []
        }
    },

    getCities: async (district) => {
        try {
            // FETCH cities for district
            return []
        } catch (error) {
            return []
        }
    },

    // 3. Create Order
    createOrder: async (order, trackingNumber, authData) => {
        try {
            const { email, password, tenant } = authData
            // potentially re-auth or use stored token. 
            // For simplicity, let's assume we pass the token or re-login here or in a wrapper.
            // ideally we shouldn't re-login every time. 

            // Let's rely on a 'token' passed in or stored in localStorage for this service?
            // Better: The calling component checks auth and passes token. 
            // But to keep it simple for the user workflow: 

            // MOCK implementation for the structure:
            const payload = {
                waybill_number: trackingNumber, // Manual waybill
                receiver_name: order.customerName,
                receiver_address: order.address,
                receiver_phone: order.phone || order.whatsapp,
                city: order.nearestCity,
                district: order.district,
                cod_amount: order.paymentStatus === 'Paid' ? 0 : (order.totalPrice || 0),
                // ... other fields
            }

            // POST to /order
            // const response = await fetch(...)

            // Mock success for now until we have real endpoints
            console.log('Pushing to Curfox:', payload)
            return true
        } catch (error) {
            console.error('Create Order Error:', error)
            throw error
        }
    },

    // 4. Tracking
    getTracking: async (waybill, authData) => {
        try {
            // GET /order/tracking-info?waybill=...
            return [
                { status: 'Pending', description: 'Order created', date: new Date().toISOString() }
            ]
        } catch (error) {
            return []
        }
    }
}
