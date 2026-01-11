import { ChevronUp, ChevronDown } from 'lucide-react'

/**
 * Collapsible Section Component
 * A reusable expandable/collapsible card section
 * 
 * Usage:
 * <CollapsibleSection
 *   title="Section Title"
 *   icon={IconComponent}
 *   isExpanded={isExpanded}
 *   onToggle={() => setExpanded(!isExpanded)}
 *   danger={false}
 * >
 *   {children}
 * </CollapsibleSection>
 */
const CollapsibleSection = ({ title, icon: Icon, isExpanded, onToggle, children, danger = false }) => {
    return (
        <div className="card" style={{
            marginBottom: '1.5rem',
            border: danger ? '1px solid rgba(239, 68, 68, 0.3)' : undefined,
            backgroundColor: danger ? 'rgba(239, 68, 68, 0.05)' : undefined
        }}>
            <button
                onClick={onToggle}
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    marginBottom: isExpanded ? '1.5rem' : 0
                }}
            >
                <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: danger ? 'var(--danger)' : 'var(--text-primary)',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {Icon && <Icon size={20} color={danger ? 'var(--danger)' : undefined} />}
                    {title}
                </h2>
                {isExpanded ? (
                    <ChevronUp size={20} color={danger ? 'var(--danger)' : 'var(--text-secondary)'} />
                ) : (
                    <ChevronDown size={20} color={danger ? 'var(--danger)' : 'var(--text-secondary)'} />
                )}
            </button>

            {isExpanded && (
                <div style={{ animation: 'fadeIn 0.2s ease' }}>
                    {children}
                </div>
            )}
        </div>
    )
}

export default CollapsibleSection
