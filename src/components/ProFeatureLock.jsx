import { Lock, Crown, CheckCircle } from 'lucide-react'
import { useLicensing } from './LicensingContext'

/**
 * ProFeatureLock - Wraps Pro-only features with a lock overlay for Free users
 * 
 * Usage:
 * <ProFeatureLock featureName="Inventory Management">
 *   <InventoryComponent />
 * </ProFeatureLock>
 */
const ProFeatureLock = ({ children, featureName = 'This feature', features = [], showContent = true }) => {
  const { isProUser } = useLicensing()

  const handleUpgradeClick = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-view', {
      detail: { view: 'profile', section: 'license-plan-section' }
    }));
  }

  // Pro users see the full content
  if (isProUser) {
    return children
  }

  // Free users see content with lock overlay or just the lock message
  return (
    <div className="pro-feature-lock-container">
      {showContent && (
        <div className="pro-feature-lock-content">
          {children}
        </div>
      )}
      <div className="pro-feature-lock-overlay">
        <div className="pro-feature-lock-message">
          <div className="pro-feature-lock-icon">
            <Crown size={32} />
          </div>
          <h3 className="pro-feature-lock-title">
            <Crown size={20} style={{ marginRight: '0.5rem' }} />
            Pro Feature
          </h3>
          <p className="pro-feature-lock-description">
            {featureName} is available in <strong>Pro</strong> version.
          </p>

          {features.length > 0 && (
            <div className="pro-feature-list">
              {features.map((feat, i) => (
                <div key={i} className="pro-feature-item">
                  <CheckCircle size={14} className="pro-feature-check" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}

          <button className="pro-upgrade-btn" onClick={handleUpgradeClick}>
            <Crown size={16} />
            Upgrade to Pro
          </button>
        </div>
      </div>
      <style>{`
        .pro-feature-lock-container {
          position: relative;
          width: 100%;
          min-height: ${showContent ? 'auto' : 'calc(100vh - 200px)'};
          display: ${showContent ? 'block' : 'flex'};
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .pro-feature-lock-content {
          width: 100%;
          opacity: 0.6;
          pointer-events: none;
          user-select: none;
          filter: grayscale(0.5);
        }

        .pro-feature-lock-overlay {
          position: ${showContent ? 'absolute' : 'relative'};
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${showContent ? 'rgba(0, 0, 0, 0.2)' : 'transparent'};
          backdrop-filter: ${showContent ? 'blur(2px)' : 'none'};
          z-index: 10;
          border-radius: inherit;
          width: 100%;
        }

        .pro-feature-lock-message {
          text-align: center;
          padding: 1.5rem;
          background: var(--bg-card);
          border: 1.5px solid var(--accent-primary);
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
          max-width: 340px;
          animation: slideUp 0.4s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .pro-feature-lock-icon {
          width: 54px;
          height: 54px;
          margin: 0 auto 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
          border-radius: 50%;
          color: white;
          box-shadow: 0 4px 15px rgba(255, 46, 54, 0.3);
        }

        .pro-feature-lock-title {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.75rem;
        }

        .pro-feature-lock-description {
          color: var(--text-secondary);
          margin: 0 0 0.5rem;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .pro-feature-lock-hint {
          display: none;
        }

        .pro-upgrade-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding: 0.85rem;
          background: var(--accent-primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .pro-upgrade-btn:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .pro-upgrade-btn:active {
          transform: translateY(0);
        }

        .pro-feature-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin: 1.25rem 0;
          text-align: left;
          background: rgba(255, 255, 255, 0.03);
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .pro-feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .pro-feature-check {
          color: #22c55e;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  )
}

/**
 * ProFeatureBadge - Small lock badge for inline Pro feature indicators
 */
export const ProFeatureBadge = ({ size = 16, onClick }) => {
  const { isProUser } = useLicensing()

  if (isProUser) {
    return null
  }

  // Handle click to navigate to settings/upgrade if onClick provided or default behavior
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
      return;
    }
    // Dispatch global navigation event
    window.dispatchEvent(new CustomEvent('navigate-to-view', {
      detail: { view: 'profile', section: 'license-plan-section' }
    }));
  };

  return (
    <>
      <span
        className="pro-feature-badge animate-pulse-subtle"
        onClick={handleClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.2rem',
          marginLeft: '0.5rem',
          color: 'var(--accent-primary)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          padding: '2px 6px',
          borderRadius: '6px',
          fontSize: '0.7rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          position: 'relative'
        }}
        role="button"
        tabIndex={0}
      >
        <Crown size={size - 2} strokeWidth={2.5} />
        PRO

        {/* Tooltip on hover */}
        <span className="pro-tooltip">
          Unlock with Pro
        </span>
      </span>
      <style>{`
            @keyframes pulse-subtle {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.85; transform: scale(1.02); }
            }
            .animate-pulse-subtle {
                animation: pulse-subtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            .pro-feature-badge:hover {
                background-color: rgba(239, 68, 68, 0.2) !important;
            }
            .pro-tooltip {
                visibility: hidden;
                width: 140px;
                background-color: var(--bg-card);
                border: 1px solid var(--border-color);
                box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                color: var(--text-primary);
                text-align: center;
                border-radius: 8px;
                padding: 8px;
                position: absolute;
                z-index: 9999;
                bottom: 125%; /* Position above */
                left: 50%;
                transform: translateX(-50%);
                opacity: 0;
                transition: opacity 0.3s;
                font-size: 0.75rem;
                font-weight: 500;
                text-transform: none;
                pointer-events: none;
                backdrop-filter: blur(12px);
            }
            .pro-tooltip::after {
                content: "";
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: var(--border-color) transparent transparent transparent;
            }
            .pro-feature-badge:hover .pro-tooltip {
                visibility: visible;
                opacity: 1;
            }

        `}</style>
    </>
  )
}

export default ProFeatureLock
