import React from 'react'
import { Crown } from 'lucide-react'
import CustomDatePicker from '../Common/CustomDatePicker'
import CustomDropdown from '../Common/CustomDropdown'
import FormValidation from '../FormValidation'
import { formatWhatsAppForStorage } from '../../utils/whatsapp'

const OrderFormCustomer = ({
    formData,
    handleChange,
    setFormData,
    validationErrors,
    getErrorStyle,
    districts,
    availableCities,
    isFreeUser,
    isCurfoxEnabled,
    checkIsBlacklisted,
    onBlacklistWarning,
    orderNumber,
    setOrderNumber,
    isMobile
}) => {
    return (
        <div style={isMobile ? {} : { marginBottom: '1rem' }}>
            {!isMobile && <h3 style={{ margin: 0, marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 600 }}>Customer Details</h3>}

            {/* Order Number and Date */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Order Number</label>
                    <input
                        type="text"
                        name="orderNumber"
                        className="form-input"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="Auto-filled"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Date *</label>
                    <CustomDatePicker
                        value={formData.orderDate}
                        onChange={(val) => {
                            handleChange({ target: { name: 'orderDate', value: val } })
                        }}
                        error={validationErrors.orderDate}
                    />
                    <FormValidation message={validationErrors.orderDate} />
                </div>
            </div>

            {/* Customer Name */}
            <div className="form-group">
                <label className="form-label">Customer Name *</label>
                <input
                    type="text"
                    name="customerName"
                    className="form-input"
                    style={getErrorStyle('customerName')}
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                />
                <FormValidation message={validationErrors.customerName} />
            </div>

            {/* Address */}
            <div className="form-group">
                <label className="form-label">Address *</label>
                <textarea
                    name="address"
                    className="form-input"
                    style={getErrorStyle('address')}
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    required
                />
                <FormValidation message={validationErrors.address} />
            </div>

            {/* WhatsApp Number and Phone Number */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">WhatsApp Number *</label>
                    <input
                        type="tel"
                        name="whatsapp"
                        className="form-input"
                        style={getErrorStyle('whatsapp')}
                        value={formData.whatsapp}
                        onChange={handleChange}
                        onBlur={() => {
                            if (formData.whatsapp) {
                                const formatted = formatWhatsAppForStorage(formData.whatsapp)
                                setFormData(prev => ({ ...prev, whatsapp: formatted }))

                                // Check for blacklist
                                if (checkIsBlacklisted && onBlacklistWarning) {
                                    const count = checkIsBlacklisted(formatted)
                                    if (count > 0) {
                                        onBlacklistWarning(formatted, count)
                                    }
                                }
                            }
                        }}
                        required
                    />
                    <FormValidation message={validationErrors.whatsapp} />
                </div>
                <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        className="form-input"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Optional"
                    />
                </div>
            </div>

            {/* Nearest City and District */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        District
                        {isFreeUser && <Crown size={12} color="var(--accent-primary)" />}
                    </label>
                    <CustomDropdown
                        options={districts.map(d => ({ value: d, label: d }))}
                        value={formData.district}
                        onChange={(val) => handleChange({ target: { name: 'district', value: val } })}
                        placeholder="Select District"
                        isLocked={isFreeUser}
                        lockIcon={Crown}
                        searchable={true}
                    />
                    <FormValidation message={validationErrors.district} />
                </div>
                <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Nearest City
                        {isFreeUser && <Crown size={12} color="var(--accent-primary)" />}
                    </label>
                    <input
                        type="text"
                        name="nearestCity"
                        className="form-input"
                        value={formData.nearestCity}
                        onChange={handleChange}
                        placeholder={isFreeUser ? "Pro feature" : "e.g., Colombo"}
                        autoComplete="off"
                        list={isCurfoxEnabled ? "curfox-city-list" : undefined}
                        disabled={isFreeUser}
                        style={isFreeUser ? { backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed', opacity: 0.7 } : {}}
                    />
                    {isCurfoxEnabled && (
                        <datalist id="curfox-city-list">
                            {availableCities.map((city, idx) => (
                                <option key={`${city}-${idx}`} value={city} />
                            ))}
                        </datalist>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OrderFormCustomer
