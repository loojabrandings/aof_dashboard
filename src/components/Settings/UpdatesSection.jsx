import React, { useState } from 'react'
import { RefreshCw, Download, CheckCircle2, AlertCircle, Info, Zap, ShieldCheck } from 'lucide-react'

const UpdatesSection = ({ updateManager }) => {
    const {
        status,
        progress,
        updateInfo,
        error,
        autoUpdate,
        setAutoUpdate,
        checkForUpdates,
        startDownload,
        installUpdate
    } = updateManager

    const [isChecking, setIsChecking] = useState(false)

    const handleManualCheck = async () => {
        setIsChecking(true)
        await checkForUpdates()
        setIsChecking(false)
    }

    const renderStatus = () => {
        switch (status) {
            case 'checking':
                return (
                    <div className="update-status-card checking">
                        <RefreshCw size={24} className="animate-spin" />
                        <div>
                            <h4>Checking for updates...</h4>
                            <p>Connecting to GitHub to verify versioning.</p>
                        </div>
                    </div>
                )
            case 'available':
                return (
                    <div className="update-status-card available">
                        <Info size={24} color="var(--accent-primary)" />
                        <div style={{ flex: 1 }}>
                            <h4>New Update Available (v{updateInfo?.version})</h4>
                            <p>A new version is ready to be downloaded.</p>
                            {updateInfo?.releaseNotes && (
                                <div className="release-notes-preview">
                                    <strong>What's New:</strong>
                                    <p>{updateInfo.releaseNotes}</p>
                                </div>
                            )}
                        </div>
                        <button className="btn btn-primary" onClick={startDownload}>
                            <Download size={18} />
                            Download Now
                        </button>
                    </div>
                )
            case 'downloading':
                return (
                    <div className="update-status-card downloading">
                        <Download size={24} className="animate-bounce" />
                        <div style={{ flex: 1 }}>
                            <h4>Downloading Update...</h4>
                            <div className="update-progress-bar">
                                <div className="update-progress-fill" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p>{Math.round(progress)}% completed</p>
                        </div>
                    </div>
                )
            case 'ready':
                return (
                    <div className="update-status-card ready">
                        <CheckCircle2 size={24} color="var(--success)" />
                        <div style={{ flex: 1 }}>
                            <h4>Update Ready to Install!</h4>
                            <p>The new version is downloaded. Restart the app to apply changes.</p>
                        </div>
                        <button className="btn btn-primary" onClick={installUpdate}>
                            <RefreshCw size={18} />
                            Install & Restart
                        </button>
                    </div>
                )
            case 'none':
                return (
                    <div className="update-status-card up-to-date">
                        <CheckCircle2 size={24} color="var(--success)" />
                        <div>
                            <h4>You're up to date!</h4>
                            <p>AOF Biz is running the latest version.</p>
                        </div>
                    </div>
                )
            case 'idle':
            default:
                if (error) {
                    return (
                        <div className="update-status-card error">
                            <AlertCircle size={24} color="var(--danger)" />
                            <div>
                                <h4>Update Check Failed</h4>
                                <p>{error}</p>
                            </div>
                        </div>
                    )
                }
                return null
        }
    }

    return (
        <div className="updates-container animate-fade-in">
            <div className="updates-header">
                <div>
                    <h3>Software Updates</h3>
                    <p>Keep your system modern and secure with the latest features.</p>
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={handleManualCheck}
                    disabled={status === 'checking' || status === 'downloading' || isChecking}
                >
                    <RefreshCw size={18} className={isChecking ? 'animate-spin' : ''} />
                    Check for Updates
                </button>
            </div>

            <div className="updates-content">
                {renderStatus()}

                <div className="updates-settings-grid">
                    <div className="update-config-card">
                        <div className="config-header">
                            < Zap size={20} color="var(--accent-primary)" />
                            <span>Preferences</span>
                        </div>
                        <label className="config-item">
                            <div className="config-info">
                                <strong>Auto Update</strong>
                                <p>Download and notify when updates are ready to install.</p>
                            </div>
                            <div className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={autoUpdate}
                                    onChange={(e) => setAutoUpdate(e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </div>
                        </label>
                    </div>

                    <div className="update-config-card">
                        <div className="config-header">
                            <ShieldCheck size={20} color="var(--success)" />
                            <span>Security</span>
                        </div>
                        <div className="config-item">
                            <div className="config-info">
                                <strong>Verified Source</strong>
                                <p>Updates are delivered securely via GitHub Releases.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .updates-container {
                    padding: 1rem 0;
                }
                .updates-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid var(--border-color);
                }
                .updates-header h3 { font-size: 1.25rem; font-weight: 800; margin: 0; }
                .updates-header p { color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0 0; }

                .update-status-card {
                    background: rgba(var(--accent-rgb), 0.03);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    margin-bottom: 2rem;
                }
                .update-status-card.ready { border-color: var(--success); background: rgba(var(--success-rgb), 0.05); }
                .update-status-card.available { border-color: var(--accent-primary); background: rgba(var(--accent-rgb), 0.05); }
                
                .update-status-card h4 { margin: 0; font-size: 1.1rem; font-weight: 700; }
                .update-status-card p { margin: 0.25rem 0 0 0; color: var(--text-secondary); font-size: 0.9rem; }

                .release-notes-preview {
                    margin-top: 1rem;
                    padding: 1rem;
                    background: rgba(0,0,0,0.2);
                    border-radius: 8px;
                    font-size: 0.85rem;
                }

                .update-progress-bar {
                    width: 100%;
                    height: 8px;
                    background: var(--border-color);
                    border-radius: 4px;
                    margin: 0.75rem 0;
                    overflow: hidden;
                }
                .update-progress-fill {
                    height: 100%;
                    background: var(--accent-primary);
                    transition: width 0.3s ease;
                }

                .updates-settings-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                .update-config-card {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    padding: 1.25rem;
                }

                .config-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.25rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid var(--border-color);
                    font-weight: 700;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .config-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                }

                .config-info strong { font-size: 0.95rem; display: block; margin-bottom: 0.25rem; }
                .config-info p { margin: 0; font-size: 0.8rem; color: var(--text-muted); }

                /* Toggle Switch Styles */
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 24px;
                    flex-shrink: 0;
                }
                .toggle-switch input { opacity: 0; width: 0; height: 0; }
                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #444;
                    transition: .4s;
                    border-radius: 24px;
                }
                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px; width: 18px;
                    left: 3px; bottom: 3px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .toggle-slider { background-color: var(--accent-primary); }
                input:checked + .toggle-slider:before { transform: translateX(20px); }
            `}</style>
        </div>
    )
}

export default UpdatesSection
