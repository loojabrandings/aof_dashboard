import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import DateRangeFilter from '../DateRangeFilter'

const CollapsibleDateFilter = ({
    filterType,
    onFilterTypeChange,
    selectedMonth,
    onMonthChange,
    startDate,
    endDate,
    onRangeChange,
    onReset,
    align = 'right',
    buttonClassName = 'btn btn-secondary'
}) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const isCustomFilter = filterType !== 'month' || selectedMonth !== format(new Date(), 'yyyy-MM')

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={buttonClassName}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '40px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    position: 'relative'
                }}
                title="Date filter"
            >
                <Calendar size={20} />
                {isCustomFilter && (
                    <span style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-primary)',
                        border: '2px solid var(--bg-card)'
                    }} />
                )}
            </button>

            {isExpanded && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 999,
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(2px)'
                        }}
                        onClick={() => setIsExpanded(false)}
                    />
                    <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        [align]: 0,
                        zIndex: 1000,
                        backgroundColor: 'var(--bg-primary)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                        minWidth: '340px',
                        animation: 'dropdownFadeIn 0.2s ease'
                    }}>
                        <DateRangeFilter
                            filterType={filterType}
                            onFilterTypeChange={onFilterTypeChange}
                            selectedMonth={selectedMonth}
                            onMonthChange={onMonthChange}
                            startDate={startDate}
                            endDate={endDate}
                            onRangeChange={onRangeChange}
                            onReset={onReset}
                            align={align}
                        />
                    </div>

                    <style>{`
            @keyframes dropdownFadeIn {
              from {
                opacity: 0;
                transform: translateY(-8px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
                </>
            )}
        </div>
    )
}

export default CollapsibleDateFilter
