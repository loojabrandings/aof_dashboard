/**
 * CloudSyncSetup Component - Wizard UI
 * 
 * Simplified step-by-step wizard for Supabase cloud sync configuration.
 * Only requires Project URL and Anon Key.
 */

import { useState, useEffect } from 'react'
import {
    Cloud, Check, Loader, Copy, ExternalLink,
    Database, Wifi, WifiOff, RefreshCw, User, LogOut, Mail,
    Lock, UserPlus, ChevronRight, CheckCircle2
} from 'lucide-react'
import {
    saveSupabaseCredentials,
    testSupabaseConnection,
    isSupabaseConfigured,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    onAuthStateChange
} from '../../utils/supabaseClient'
import { fullSync, getLastSyncTime } from '../../utils/syncEngine'
import { useToast } from '../Toast/ToastContext'
import { useLicensing } from '../LicensingContext'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

// Helper to open URLs in default browser (works in Electron and web)
const openExternalUrl = (url) => {
    if (window.electronAPI?.openExternal) {
        // Electron - open in system browser
        window.electronAPI.openExternal(url)
    } else {
        // Web fallback
        window.open(url, '_blank', 'noopener,noreferrer')
    }
}


// SQL Script for manual setup
const SETUP_SQL = `-- AOF Biz Database Setup Script
-- Run this in your Supabase SQL Editor (https://app.supabase.com)

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tracking_numbers (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_sources (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own orders" ON orders;
DROP POLICY IF EXISTS "Users can manage own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can manage own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can manage own settings" ON settings;
DROP POLICY IF EXISTS "Users can manage own tracking_numbers" ON tracking_numbers;
DROP POLICY IF EXISTS "Users can manage own order_sources" ON order_sources;
DROP POLICY IF EXISTS "Users can manage own products" ON products;

CREATE POLICY "Users can manage own orders" ON orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own expenses" ON expenses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own inventory" ON inventory FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own settings" ON settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own tracking_numbers" ON tracking_numbers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own order_sources" ON order_sources FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own products" ON products FOR ALL USING (auth.uid() = user_id);
`

// Wizard Steps (simplified)
const STEPS = [
    { id: 1, name: 'Create Project', icon: Database },
    { id: 2, name: 'Setup Tables', icon: Database },
    { id: 3, name: 'Connect', icon: Cloud },
    { id: 4, name: 'Sign In', icon: User }
]

const CloudSyncSetup = () => {
    const { addToast } = useToast()
    const { isProUser } = useLicensing()
    const isOnline = useOnlineStatus()

    // Wizard state
    const [currentStep, setCurrentStep] = useState(1)
    const [completedSteps, setCompletedSteps] = useState([])

    // Form state
    const [projectUrl, setProjectUrl] = useState('')
    const [anonKey, setAnonKey] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authMode, setAuthMode] = useState('login')

    // Status state
    const [isConfigured, setIsConfigured] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [lastSynced, setLastSynced] = useState(null)
    const [isSyncing, setIsSyncing] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)

    // Check config and auth on mount
    useEffect(() => {
        const checkConfigAndAuth = async () => {
            const configured = await isSupabaseConfigured()
            setIsConfigured(configured)

            if (configured) {
                const result = await testSupabaseConnection()

                const syncTime = await getLastSyncTime()
                setLastSynced(syncTime)

                const user = await getCurrentUser()
                setCurrentUser(user)

                // Skip to appropriate step based on current state
                if (user) {
                    setCompletedSteps([1, 2, 3, 4])
                    setCurrentStep(4)
                } else if (result.success) {
                    setCompletedSteps([1, 2, 3])
                    setCurrentStep(4)
                }
            }
            setAuthLoading(false)
        }
        checkConfigAndAuth()

        let unsubscribe = () => { }
        const setupAuthListener = async () => {
            unsubscribe = await onAuthStateChange((event, session) => {
                setCurrentUser(session?.user || null)
            })
        }
        setupAuthListener()

        return () => unsubscribe()
    }, [])

    // Mark step as complete and proceed
    const completeStep = (stepId) => {
        if (!completedSteps.includes(stepId)) {
            setCompletedSteps([...completedSteps, stepId])
        }
        if (stepId < 4) {
            setCurrentStep(stepId + 1)
        }
    }

    // Step 1: User has a project
    const handleHasProject = () => {
        completeStep(1)
    }

    // Step 2: Copy SQL
    const handleCopySQL = async () => {
        try {
            await navigator.clipboard.writeText(SETUP_SQL)
            addToast('SQL script copied to clipboard!', 'success')
        } catch {
            addToast('Failed to copy', 'error')
        }
    }

    // Step 3: Connect API
    const handleConnect = async () => {
        if (!projectUrl.trim() || !anonKey.trim()) {
            addToast('Please enter both Project URL and Anon Key', 'warning')
            return
        }

        setIsLoading(true)
        try {
            await saveSupabaseCredentials(projectUrl.trim(), anonKey.trim())
            const result = await testSupabaseConnection()

            if (result.success) {
                setIsConfigured(true)
                addToast('Connected successfully!', 'success')
                completeStep(3)
            } else {
                addToast(result.error, 'error')
            }
        } catch (error) {
            addToast(`Error: ${error.message}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    // Step 4: Sign in
    const handleAuth = async () => {
        if (!email.trim() || !password.trim()) {
            addToast('Please enter email and password', 'warning')
            return
        }

        setIsLoading(true)
        try {
            const result = authMode === 'login'
                ? await signIn(email.trim(), password)
                : await signUp(email.trim(), password)

            if (result.success) {
                setCurrentUser(result.user)
                addToast(authMode === 'login' ? 'Signed in!' : 'Account created!', 'success')
                completeStep(4)
                // Initial sync
                handleManualSync(result.user.id)
            } else {
                addToast(result.error, 'error')
            }
        } catch (error) {
            addToast(error.message, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    // Sign out
    const handleSignOut = async () => {
        setIsLoading(true)
        try {
            const result = await signOut()
            if (result.success) {
                setCurrentUser(null)
                addToast('Signed out', 'success')
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Manual sync
    const handleManualSync = async (userId = null) => {
        const uid = userId || currentUser?.id
        if (!uid) return

        setIsSyncing(true)
        try {
            const result = await fullSync(uid)
            if (result.success) {
                const syncTime = await getLastSyncTime()
                setLastSynced(syncTime)
                addToast('Sync complete!', 'success')
            } else {
                addToast(`Sync failed: ${result.error}`, 'error')
            }
        } catch (error) {
            addToast(`Error: ${error.message}`, 'error')
        } finally {
            setIsSyncing(false)
        }
    }

    if (!isProUser) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Cloud size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <p>Cloud Sync is a Pro feature. Upgrade to enable multi-device synchronization.</p>
            </div>
        )
    }

    // Fully configured and signed in - show sync status
    if (isConfigured && currentUser) {
        return (
            <div style={{ padding: '1.5rem' }}>
                {/* Sync Status Card */}
                <div style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle2 size={24} color="var(--success)" />
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Cloud Sync Active</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {lastSynced ? `Last synced: ${new Date(lastSynced).toLocaleString()}` : 'Ready to sync'}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {isOnline ? <Wifi size={16} color="var(--success)" /> : <WifiOff size={16} color="var(--text-muted)" />}
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleManualSync()}
                                disabled={isSyncing || !isOnline}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                <RefreshCw size={14} className={isSyncing ? 'spin' : ''} />
                                {isSyncing ? 'Syncing...' : 'Sync Now'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div style={{
                    padding: '1rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: '50%',
                            backgroundColor: 'var(--accent-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 600
                        }}>
                            {currentUser.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>{currentUser.email}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed in</div>
                        </div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={handleSignOut} disabled={isLoading}>
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </div>
        )
    }

    // Wizard UI
    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Progress Indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                {STEPS.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id)
                    const isCurrent = currentStep === step.id
                    const StepIcon = step.icon

                    return (
                        <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    cursor: isCompleted ? 'pointer' : 'default',
                                    opacity: isCurrent || isCompleted ? 1 : 0.4
                                }}
                                onClick={() => isCompleted && setCurrentStep(step.id)}
                            >
                                <div style={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: isCompleted ? 'var(--success)' : isCurrent ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                    color: isCompleted || isCurrent ? 'white' : 'var(--text-muted)',
                                    marginBottom: '0.25rem',
                                    transition: 'all 0.2s'
                                }}>
                                    {isCompleted ? <Check size={18} /> : <StepIcon size={18} />}
                                </div>
                                <span style={{
                                    fontSize: '0.7rem',
                                    color: isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)',
                                    fontWeight: isCurrent ? 600 : 400,
                                    whiteSpace: 'nowrap'
                                }}>
                                    {step.name}
                                </span>
                            </div>
                            {index < STEPS.length - 1 && (
                                <ChevronRight size={16} color="var(--text-muted)" style={{ margin: '0 0.25rem', marginBottom: '1rem' }} />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Step Content */}
            <div style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)'
            }}>
                {/* Step 1: Create Project */}
                {currentStep === 1 && (
                    <div>
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Database size={20} /> Create a Supabase Project
                        </h4>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Supabase is a free database service that stores your data in the cloud for multi-device sync.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => openExternalUrl('https://database.new')}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <ExternalLink size={16} /> Open Supabase
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={handleHasProject}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Check size={16} /> I Have a Project
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Setup Tables */}
                {currentStep === 2 && (
                    <div>
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Database size={20} /> Setup Database Tables
                        </h4>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Copy the SQL script below and run it in your Supabase SQL Editor to create the required tables.
                        </p>

                        <div style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            padding: '1rem',
                            borderRadius: 'var(--radius)',
                            marginBottom: '1rem',
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)'
                        }}>
                            <strong>Steps:</strong>
                            <ol style={{ margin: '0.5rem 0 0 1rem', paddingLeft: '0.5rem' }}>
                                <li>Click "Copy SQL Script" below</li>
                                <li>Click "Open SQL Editor" to go to Supabase</li>
                                <li>Paste the script and click "Run"</li>
                            </ol>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <button className="btn btn-secondary" onClick={handleCopySQL}>
                                <Copy size={16} /> Copy SQL Script
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => openExternalUrl('https://app.supabase.com/project/_/sql')}
                            >
                                <ExternalLink size={16} /> Open SQL Editor
                            </button>
                        </div>

                        <button className="btn btn-primary" onClick={() => completeStep(2)}>
                            <Check size={16} /> Done, Continue
                        </button>
                    </div>
                )}

                {/* Step 3: Connect API */}
                {currentStep === 3 && (
                    <div>
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Cloud size={20} /> Connect to Supabase
                        </h4>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Enter your API credentials from <strong>Supabase → Project Settings → API</strong>
                        </p>

                        <div className="form-group">
                            <label className="form-label">Project URL</label>
                            <input
                                type="text"
                                className="form-input"
                                value={projectUrl}
                                onChange={(e) => setProjectUrl(e.target.value)}
                                placeholder="https://your-project.supabase.co"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Anon / Public Key</label>
                            <input
                                type="password"
                                className="form-input"
                                value={anonKey}
                                onChange={(e) => setAnonKey(e.target.value)}
                                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={handleConnect}
                            disabled={isLoading || !projectUrl.trim() || !anonKey.trim()}
                        >
                            {isLoading ? <Loader size={16} className="spin" /> : <Check size={16} />}
                            {isLoading ? ' Connecting...' : ' Connect'}
                        </button>
                    </div>
                )}

                {/* Step 4: Sign In */}
                {currentStep === 4 && (
                    <div>
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={20} /> {authMode === 'login' ? 'Sign In' : 'Create Account'}
                        </h4>

                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <button
                                className={`btn btn-sm ${authMode === 'login' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setAuthMode('login')}
                            >
                                Sign In
                            </button>
                            <button
                                className={`btn btn-sm ${authMode === 'signup' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setAuthMode('signup')}
                            >
                                Create Account
                            </button>
                        </div>

                        <div className="form-group">
                            <label className="form-label"><Mail size={14} /> Email</label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label"><Lock size={14} /> Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={handleAuth}
                            disabled={isLoading || !email.trim() || !password.trim()}
                            style={{ width: '100%' }}
                        >
                            {isLoading ? <Loader size={16} className="spin" /> : authMode === 'login' ? <User size={16} /> : <UserPlus size={16} />}
                            {isLoading ? ' Please wait...' : authMode === 'login' ? ' Sign In' : ' Create Account'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CloudSyncSetup
