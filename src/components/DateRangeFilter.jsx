import React from 'react'
import { X, Calendar } from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import CustomDropdown from './Common/CustomDropdown'
import CustomDatePicker from './Common/CustomDatePicker'

const DateRangeFilter = ({
    filterType,
    onFilterTypeChange,
    selectedMonth,
    onMonthChange,
    startDate,
    endDate,
    onRangeChange,
    onReset,
    align = 'left'
}) => {
    // Helper to determine if the reset button should be shown
    const showReset = filterType !== 'month' || selectedMonth !== format(new Date(), 'yyyy-MM')

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
                width: '100%',
                maxWidth: filterType === 'range' ? '100%' : 'auto'
            }}>
                <div style={{ width: '100%', maxWidth: '160px', minWidth: '140px' }}>
                    <CustomDropdown
                        options={[
                            { value: 'month', label: 'By Month' },
                            { value: 'range', label: 'Custom Range' }
                        ]}
                        value={filterType}
                        onChange={onFilterTypeChange}
                    />
                </div>

                {filterType === 'month' ? (
                    <div style={{ width: '100%', maxWidth: '160px', minWidth: '140px' }}>
                        <CustomDatePicker
                            type="month"
                            value={selectedMonth}
                            onChange={(val) => onMonthChange(val)}
                            align={align}
                        />
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        width: '100%'
                    }}>
                        <div style={{ flex: '1 1 140px', minWidth: '140px', maxWidth: '160px' }}>
                            <CustomDatePicker
                                type="date"
                                value={startDate}
                                onChange={(val) => onRangeChange({ startDate: val, endDate })}
                                align={align}
                            />
                        </div>
                        <span style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            flexShrink: 0,
                            padding: '0 0.25rem'
                        }}>to</span>
                        <div style={{ flex: '1 1 140px', minWidth: '140px', maxWidth: '160px' }}>
                            <CustomDatePicker
                                type="date"
                                value={endDate}
                                onChange={(val) => onRangeChange({ startDate, endDate: val })}
                                align={align}
                            />
                        </div>
                    </div>
                )}
            </div>

            {showReset && (
                <button
                    onClick={onReset}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))',
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                        minWidth: 'fit-content'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(239, 68, 68, 0.1))'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))'
                        e.currentTarget.style.transform = 'translateY(0)'
                    }}
                    title="Reset to current month"
                >
                    <X size={16} /> Clear
                </button>
            )}
        </div>
    )
}

export default DateRangeFilter
