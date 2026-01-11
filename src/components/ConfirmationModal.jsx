import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'default', // default (info), success, danger, warning
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    extraButtonText,
    onExtraButtonClick,
    extraButtonDisabled = false,
    extraButtonClass = 'btn-primary',
    confirmDisabled = false,
    isAlert = false // if true, only show OK button
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger': return <AlertTriangle size={24} color="var(--error)" />;
            case 'warning': return <AlertTriangle size={24} color="var(--warning)" />;
            case 'success': return <CheckCircle size={24} color="var(--success)" />;
            default: return <Info size={24} color="var(--accent-primary)" />;
        }
    };

    const getButtonClass = () => {
        switch (type) {
            case 'danger': return 'btn-danger';
            case 'success': return 'btn-success'; // assuming btn-success exists or falls back
            default: return 'btn-primary';
        }
    };

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            style={{
                zIndex: 2000,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                animation: 'fadeIn 0.2s ease-out'
            }}
        >
            <div
                className="modal-content"
                onClick={e => e.stopPropagation()}
                style={{
                    maxWidth: '440px',
                    textAlign: 'center',
                    padding: '2rem',
                    backgroundColor: 'var(--modal-bg)', // Should be opaque via CSS
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--border-color)',
                    animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        padding: '1.25rem',
                        borderRadius: '20px',
                        backgroundColor: type === 'danger' ? 'rgba(239, 68, 68, 0.12)' :
                            type === 'warning' ? 'rgba(245, 158, 11, 0.12)' :
                                type === 'success' ? 'rgba(16, 185, 129, 0.12)' :
                                    'rgba(59, 130, 246, 0.12)',
                        color: type === 'danger' ? 'var(--error)' :
                            type === 'warning' ? 'var(--warning)' :
                                type === 'success' ? 'var(--success)' :
                                    'var(--accent-primary)'
                    }}>
                        {getIcon()}
                    </div>
                </div>

                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                    {title}
                </h3>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    {message}
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'stretch', flexWrap: 'wrap' }}>
                    {!isAlert && (
                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                            style={{ flex: 1, minWidth: '120px', justifyContent: 'center', padding: '0.75rem' }}
                        >
                            {cancelText}
                        </button>
                    )}

                    {extraButtonText && (
                        <button
                            className={`btn ${extraButtonClass}`}
                            onClick={() => {
                                if (onExtraButtonClick) onExtraButtonClick();
                                onClose();
                            }}
                            disabled={extraButtonDisabled}
                            style={{ flex: 1, minWidth: '120px', justifyContent: 'center', padding: '0.75rem' }}
                        >
                            {extraButtonText}
                        </button>
                    )}

                    <button
                        className={`btn ${getButtonClass()}`}
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            onClose();
                        }}
                        disabled={confirmDisabled}
                        style={{ flex: 1, minWidth: '120px', justifyContent: 'center', padding: '0.75rem' }}
                    >
                        {isAlert ? 'OK' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
