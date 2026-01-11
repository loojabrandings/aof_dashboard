import React from 'react'
import { Crown } from 'lucide-react'
import CustomDropdown from '../Common/CustomDropdown'
import FormValidation from '../FormValidation'
import TrackingNumberInput from '../TrackingNumberInput'

const OrderFormLogistics = ({
    formData,
    handleChange,
    validationErrors,
    isFreeUser,
    isCurfoxEnabled,
    orderSources,
    isMobile
}) => {
    return (
        <div style={isMobile ? {} : { marginBottom: '1rem' }}>
            {!isMobile && <h3 style={{ margin: 0, marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 600 }}>Logistics & Notes</h3>}

            {/* Notes */}
            <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Notes
                    {isFreeUser && <Crown size={12} color="var(--accent-primary)" />}
                </label>
                <textarea
                    name="notes"
                    className="form-input"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder={isFreeUser ? "Pro feature" : "Special instructions..."}
                    disabled={isFreeUser}
                    style={isFreeUser ? { backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed', opacity: 0.7 } : {}}
                />
            </div>

            {/* Status */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Status *
                        {isFreeUser && <Crown size={12} color="var(--accent-primary)" />}
                    </label>
                    <CustomDropdown
                        options={[
                            { value: 'New Order', label: 'New Order' },
                            { value: 'Packed', label: 'Packed' },
                            { value: 'Dispatched', label: 'Dispatched' },
                            { value: 'returned', label: 'Returned' },
                            { value: 'refund', label: 'Refund' },
                            { value: 'cancelled', label: 'Cancelled' }
                        ]}
                        value={formData.status}
                        onChange={(val) => handleChange({ target: { name: 'status', value: val } })}
                        isLocked={isFreeUser}
                        lockIcon={Crown}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Payment Status *
                        {isFreeUser && <Crown size={12} color="var(--accent-primary)" />}
                    </label>
                    <CustomDropdown
                        options={[
                            { value: 'Pending', label: 'Pending' },
                            { value: 'Paid', label: 'Paid' }
                        ]}
                        value={formData.paymentStatus}
                        onChange={(val) => handleChange({ target: { name: 'paymentStatus', value: val } })}
                        isLocked={isFreeUser}
                        lockIcon={Crown}
                    />
                </div>
            </div>

            {(formData.status === 'Packed' || formData.status === 'Dispatched') && (
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Tracking Number</label>
                        {isCurfoxEnabled ? (
                            <div>
                                <input
                                    name="trackingNumber"
                                    className="form-input"
                                    value={formData.trackingNumber}
                                    onChange={handleChange}
                                    placeholder="Waybill ID"
                                />
                                <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Auto-generated on Dispatch
                                </small>
                            </div>
                        ) : (
                            <TrackingNumberInput
                                value={formData.trackingNumber}
                                onChange={handleChange}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Order Source */}
            <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Order Source *
                    {isFreeUser && <Crown size={12} color="var(--accent-primary)" />}
                </label>
                <CustomDropdown
                    options={(orderSources.length > 0 ? orderSources : [{ id: 'Ad', name: 'Ad' }, { id: 'Organic', name: 'Organic' }]).map(src => ({
                        value: src.name,
                        label: src.name
                    }))}
                    value={formData.orderSource}
                    onChange={(val) => {
                        handleChange({ target: { name: 'orderSource', value: val } })
                    }}
                    isLocked={isFreeUser}
                    lockIcon={Crown}
                    placeholder="Select a source"
                />
                <FormValidation message={validationErrors.orderSource} />
            </div>
        </div>
    )
}

export default OrderFormLogistics
