import React from 'react'
import { Crown } from 'lucide-react'
import CustomDropdown from '../Common/CustomDropdown'

const OrderFormPricing = ({
    formData,
    handleChange,
    subtotal,
    discountType,
    setDiscountType,
    computedTotal,
    computedBalance,
    isFreeUser,
    isMobile
}) => {
    return (
        <div style={isMobile ? {} : { marginBottom: '1rem' }}>
            {!isMobile && <h3 style={{ margin: 0, marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 600 }}>Payment Details</h3>}

            {/* Subtotal & Discount */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Subtotal</label>
                    <input className="form-input" value={subtotal.toFixed(2)} readOnly style={{ backgroundColor: 'var(--bg-primary)' }} />
                </div>
                <div className="form-group">
                    <label className="form-label">Discount</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ position: 'relative', width: '80px' }}>
                            <CustomDropdown
                                options={[
                                    { value: 'Rs', label: 'Rs' },
                                    { value: '%', label: '%' }
                                ]}
                                value={discountType}
                                onChange={(val) => handleChange({ target: { name: 'discountType', value: val } })}
                            />
                        </div>
                        <input
                            type="number"
                            name="discount"
                            className="form-input"
                            value={formData.discount}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>
            </div>

            {/* Delivery & Total */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Delivery Charge</label>
                    <input
                        type="number"
                        name="deliveryCharge"
                        className="form-input"
                        value={formData.deliveryCharge}
                        onChange={handleChange}
                        min="0"
                        step="1"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Total Price</label>
                    <input className="form-input" value={computedTotal.toFixed(2)} readOnly style={{ backgroundColor: 'var(--bg-primary)', fontWeight: 'bold' }} />
                </div>
            </div>

            {/* Advance & Balance */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Advance Payment</label>
                    <input
                        type="number"
                        name="advancePayment"
                        className="form-input"
                        value={formData.advancePayment}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Balance Remaining</label>
                    <input
                        className="form-input"
                        value={`Rs. ${(computedBalance).toFixed(2)}`}
                        readOnly
                        tabIndex="-1"
                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)' }}
                    />
                </div>
            </div>

            {/* Payment Method */}
            <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Payment Method
                    {isFreeUser && <Crown size={12} color="var(--accent-primary)" />}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexDirection: 'row' }}>
                    <button
                        type="button"
                        className={`btn ${formData.paymentMethod === 'COD' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, justifyContent: 'center', ...(isFreeUser ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }}
                        onClick={() => !isFreeUser && handleChange({ target: { name: 'paymentMethod', value: 'COD' } })}
                        disabled={isFreeUser}
                    >
                        COD
                    </button>
                    <button
                        type="button"
                        className={`btn ${formData.paymentMethod === 'Bank Deposit' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, justifyContent: 'center', ...(isFreeUser ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }}
                        onClick={() => !isFreeUser && handleChange({ target: { name: 'paymentMethod', value: 'Bank Deposit' } })}
                        disabled={isFreeUser}
                    >
                        Bank Transfer
                    </button>
                </div>
            </div>

            {/* COD Amount */}
            <div className="form-group">
                <label className="form-label">{formData.paymentMethod === 'COD' ? 'COD Amount' : 'Final Amount'}</label>
                <input
                    type="number"
                    name="codAmount"
                    className="form-input"
                    value={formData.codAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {formData.paymentMethod === 'COD'
                        ? 'Total to collect (incl. delivery)'
                        : 'Total amount order value'}
                </small>
            </div>
        </div>
    )
}

export default OrderFormPricing
