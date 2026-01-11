import { X, Keyboard } from 'lucide-react'
import { SHORTCUTS } from '../../hooks/useKeyboardShortcuts'

const KeyboardShortcutsModal = ({ onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
            <div
                className="modal-content"
                onClick={e => e.stopPropagation()}
                style={{
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div className="modal-header">
                    <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Keyboard size={24} />
                        Keyboard Shortcuts
                    </h3>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {Object.entries(SHORTCUTS).map(([category, items]) => (
                        <div key={category} style={{ marginBottom: '2rem', lastChild: { marginBottom: 0 } }}>
                            <h4 style={{
                                fontSize: '0.9rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: 'var(--text-muted)',
                                marginBottom: '1rem',
                                borderBottom: '1px solid var(--border-color)',
                                paddingBottom: '0.5rem'
                            }}>
                                {category}
                            </h4>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {items.map((item, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                            {item.description}
                                        </span>
                                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                                            {item.keys.map((key, keyIndex) => (
                                                <kbd key={keyIndex} style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '0.25rem 0.6rem',
                                                    backgroundColor: 'var(--bg-secondary)',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: '6px',
                                                    fontSize: '0.85rem',
                                                    fontFamily: 'monospace',
                                                    color: 'var(--text-secondary)',
                                                    minWidth: '24px',
                                                    boxShadow: '0 1px 1px rgba(0,0,0,0.1)'
                                                }}>
                                                    {key}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    padding: '1rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center'
                }}>
                    Press <kbd style={{ padding: '0.1rem 0.3rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>Esc</kbd> to close this window
                </div>
            </div>
        </div>
    )
}

export default KeyboardShortcutsModal
