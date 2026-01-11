import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const SummaryCard = ({ title, value, icon: Icon, color = 'var(--accent-primary)', subtitle, trend, onClick, disabled = false }) => {
  const isError = color === 'var(--error)' && !disabled
  const isClickable = onClick && !disabled

  // Convert CSS variable to rgba for background
  const getBackgroundColor = () => {
    if (disabled) return 'transparent'

    if (color === 'var(--error)') {
      return 'rgba(239, 68, 68, 0.15)' // red with 15% opacity for icon background
    } else if (color === 'var(--success)') {
      return 'rgba(34, 197, 94, 0.1)' // green with 10% opacity
    } else if (color === 'var(--warning)') {
      return 'rgba(249, 115, 22, 0.1)' // orange with 10% opacity
    } else if (color === 'var(--text-muted)') {
      return 'rgba(156, 163, 175, 0.1)' // gray with 10% opacity
    } else {
      return 'rgba(59, 130, 246, 0.1)' // default blue with 10% opacity
    }
  }

  return (
    <div
      className="card"
      onClick={isClickable ? onClick : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      tabIndex={isClickable ? 0 : -1}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.5rem',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        backgroundColor: disabled ? 'rgba(255, 255, 255, 0.02)' : (isError ? 'rgba(239, 68, 68, 0.15)' : undefined),
        border: isError ? '2px solid rgba(239, 68, 68, 0.5)' : (disabled ? '1px solid rgba(255, 255, 255, 0.05)' : undefined),
        boxShadow: isError ? '0 2px 8px rgba(239, 68, 68, 0.2)' : undefined,
        opacity: disabled ? 0.7 : 1
      }}
      onMouseEnter={(e) => {
        if (isClickable) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = ''
        }
      }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: 'var(--radius)',
        backgroundColor: getBackgroundColor(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        minWidth: '48px'
      }}>
        {Icon && (
          <Icon
            size={24}
            strokeWidth={isError ? 2.5 : 2}
            color={disabled ? 'var(--text-muted)' : (isError ? '#ef4444' : color)}
            style={{ display: 'block', opacity: disabled ? 0.3 : 1 }}
          />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          marginBottom: '0.25rem',
          fontWeight: isError ? 600 : 400
        }}>
          {title}
        </div>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: disabled ? 'var(--text-muted)' : (isError ? 'var(--error)' : 'var(--text-primary)')
        }}>
          {value}
        </h3>

        {trend && !disabled ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
            {subtitle && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {subtitle}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: trend.isPositive ? 'var(--success)' : 'var(--error)',
                backgroundColor: trend.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {trend.isPositive ? <ArrowUpRight size={12} style={{ marginRight: '2px' }} /> : <ArrowDownRight size={12} style={{ marginRight: '2px' }} />}
                {Math.abs(trend.value)}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{trend.label}</span>
            </div>
          </div>
        ) : subtitle && (
          <div style={{
            fontSize: '0.75rem',
            color: disabled ? 'var(--text-muted)' : (isError ? 'rgba(239, 68, 68, 0.8)' : 'var(--text-muted)'),
            marginTop: '0.25rem',
            fontWeight: isError ? 500 : 400,
            opacity: disabled ? 0.6 : 1
          }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}

export default SummaryCard

