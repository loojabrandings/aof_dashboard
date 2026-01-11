import React from 'react'
import { CheckCircle2, RefreshCcw, X } from 'lucide-react'

const UpdateNotification = ({ info, onInstall, onClose }) => {
    if (!info) return null

    return (
        <div className="update-toast animate-slide-up">
            <div className="update-toast-content">
                <div className="update-toast-icon">
                    <CheckCircle2 color="var(--success)" size={24} />
                </div>
                <div className="update-toast-body">
                    <p className="update-toast-title">Update Ready (v{info.version})</p>
                    <p className="update-toast-desc">The new version has been downloaded and is ready to install.</p>
                </div>
                <div className="update-toast-actions">
                    <button className="btn btn-primary" onClick={onInstall}>
                        <RefreshCcw size={16} />
                        Update Now
                    </button>
                    <button className="btn btn-icon btn-icon-ghost" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
            </div>

            <style>{`
                .update-toast {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    z-index: 10000;
                    width: 380px;
                    background: var(--glass-bg);
                    backdrop-filter: var(--glass-blur);
                    -webkit-backdrop-filter: var(--glass-blur);
                    border: 1px solid var(--accent-primary);
                    border-radius: 16px;
                    padding: 1.25rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }

                .update-toast-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                }

                .update-toast-body {
                    flex: 1;
                }

                .update-toast-title {
                    font-weight: 700;
                    font-size: 0.95rem;
                    margin-bottom: 0.25rem;
                }

                .update-toast-desc {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    line-height: 1.4;
                }

                .update-toast-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: flex-end;
                }

                @keyframes slide-up {
                    from { transform: translateY(100px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .animate-slide-up {
                    animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </div>
    )
}

export default UpdateNotification
