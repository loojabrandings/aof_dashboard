export const curfoxService = {
    baseUrl: 'https://v1.api.curfox.com/api/public/merchant',

    // Helpers
    getHeaders: (tenant, token = null) => {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-tenant': tenant
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
        return headers
    },

    // 1. Authentication
    login: async (email, password, tenant) => {
        try {
            console.log('Logging in to Curfox:', { email, tenant })
            const response = await fetch(`${curfoxService.baseUrl}/login`, {
                method: 'POST',
                headers: curfoxService.getHeaders(tenant),
                body: JSON.stringify({ email, password })
            })

            if (!response.ok) {
                const err = await response.text()
                console.error('Curfox Login Failed:', response.status, err)
                throw new Error('Login failed: ' + response.statusText)
            }

            const data = await response.json()
            console.log('Curfox Login Success:', data)

            // Return token and potentially business_id if available in response
            // Adjust based on actua response structure. common: { token: '...', user: { business_id: ... } }
            return {
                token: data.token || data.access_token,
                businessId: data.user?.business_id || data.business_id || data.merchant_business_id
            }
        } catch (error) {
            console.error('Curfox Login Error:', error)
            return null
        }
    },

    // 2. Location Services
    // Endpoint: /api/public/merchant/city
    // Endpoint: /api/public/merchant/state (assumed for districts)



    getDistricts: async (authData) => {
        try {
            const { tenant, token } = authData || {}
            if (!tenant || !token) return []

            // Fetch States (Districts)
            // Docs: noPagination - Ignores pagination
            const response = await fetch(`${curfoxService.baseUrl}/state?noPagination=1`, {
                method: 'GET',
                headers: curfoxService.getHeaders(tenant, token)
            })

            if (!response.ok) {
                console.error("Curfox State Fetch Failed:", response.status)
                return []
            }

            const data = await response.json()
            return data.data || []
        } catch (error) {
            console.error('Curfox Districts Error:', error)
            return []
        }
    },

    getCities: async (authData) => {
        try {
            const { tenant, token } = authData || {}
            if (!tenant || !token) {
                console.warn("Curfox Cities: Missing auth data")
                return []
            }

            // Get all cities
            // Docs say "noPagination" ignores pagination.
            // Also need to map nested 'state' object to 'district_name' for frontend filtering.
            const url = `${curfoxService.baseUrl}/city?noPagination=1`
            console.log('Fetching Cities URL:', url)

            const response = await fetch(url, {
                method: 'GET',
                headers: curfoxService.getHeaders(tenant, token)
            })

            if (!response.ok) {
                console.error("Curfox City Fetch Failed:", response.status, response.statusText)
                return []
            }

            const res = await response.json()
            const rawCities = res.data || []
            console.log(`Loaded ${rawCities.length} cities from Curfox`)

            if (rawCities.length > 0) {
                // Map to flattened structure for easier filtering
                return rawCities.map(city => ({
                    ...city,
                    district_name: city.state?.name || city.district_name || '',
                    name: city.name // Ensure name is top level
                }))
            }

            return []
        } catch (error) {
            console.error('Curfox Cities Error:', error)
            return []
        }
    },

    // 3. Create Order
    createOrder: async (order, trackingNumber, authData) => {
        try {
            const { email, password, tenant, token, businessId } = authData

            // We need businessId. If not saved, we might have issues.
            // Using a fallback or checking if it's passed.
            const merchantBusinessId = businessId || "YOUR_BUSINESS_ID"

            const payload = {
                general_data: {
                    merchant_business_id: merchantBusinessId,
                    origin_city_name: "Colombo", // Default or Configurable?
                    origin_state_name: "Colombo"
                },
                order_data: [{
                    waybill_number: trackingNumber,
                    customer_name: order.customerName,
                    customer_address: order.address,
                    customer_phone: order.phone || order.whatsapp,
                    destination_city_name: order.nearestCity,
                    destination_state_name: order.district,
                    cod: order.paymentStatus === 'Paid' ? 0 : (order.totalPrice || 0),
                    description: `Order #${order.id}`,
                    weight: 1, // Default
                    remark: order.notes || ""
                }]
            }

            console.log('Pushing to Curfox:', payload)

            const response = await fetch(`${curfoxService.baseUrl}/order/bulk`, {
                method: 'POST',
                headers: curfoxService.getHeaders(tenant, token),
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errText = await response.text()
                throw new Error(`Curfox Dispatch Failed: ${response.status} - ${errText}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Create Order Error:', error)
            throw error
        }
    },

    // 4. Tracking
    getTracking: async (waybill, authData) => {
        try {
            const { tenant, token } = authData || {}
            if (!tenant) return []

            // Common pattern: GET /order/tracking?waybill=...
            // Or /public/merchant/tracking/...
            // Based on search, no specific tracking endpoint found yet, 
            // but we can try a likely one or return empty to prevent errors.
            console.log('Fetching tracking for', waybill)

            // Placeholder: Assume NO tracking endpoint confirmed yet.
            // Returning empty array to avoid UI errors.
            return []
        } catch (error) {
            return []
        }
    }
}
