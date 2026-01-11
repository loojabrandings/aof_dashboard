import React, { useState, useMemo, useEffect } from 'react'
import {
    ChevronRight, ChevronDown, BookOpen, Zap, HelpCircle,
    AlertCircle, Book, ShoppingBag,
    Package, DollarSign, Settings,
    Search, Crown, Monitor, Smartphone, CheckCircle2,
    MessageCircle, AlertTriangle, Menu, X,
    Tag, Plus, UploadCloud, ArrowRight, Layout,
    Shield, Globe, Bell, Printer, Database, Moon, Sun,
    CreditCard, RefreshCw, Layers, Truck, Trash, CornerDownRight, FileText
} from 'lucide-react'
import { useTheme } from './ThemeContext'

/**
 * HelpDocs Component - Refactored for Visual Consistency
 * - Removed conflicting glassmorphism styles
 * - Aligned typographic scale and spacing with standard app pages
 * - Uses global CSS variables for colors
 */
const HelpDocs = () => {
    const { effectiveTheme } = useTheme()
    const [activeId, setActiveId] = useState('quickstart')
    const [searchTerm, setSearchTerm] = useState('')
    const [tocItems, setTocItems] = useState([])
    const [expandedNav, setExpandedNav] = useState({ 'settings_root': true, 'set_general': true, 'set_backup': true, 'set_premium': true })

    const toggleNav = (id, e) => {
        e.stopPropagation()
        setExpandedNav(prev => ({ ...prev, [id]: !prev[id] }))
    }

    // --- Content Data Structure (Identical content, removed for brevity in thought, but included in output) ---
    const DOCS_STRUCTURE = [
        {
            category: "ACADEMY",
            items: [
                {
                    id: 'quickstart', label: 'Quick Start', icon: Zap,
                    title: "Getting Started", subtitle: "Master the basics in under 5 minutes.",
                    content: (
                        <div className="doc-article">
                            <p className="lead">Welcome to AOF Biz. This guide covers the 4 essential steps to get your business running.</p>
                            <div className="step-list">
                                <div className="step-card">
                                    <div className="step-number">01</div>
                                    <div className="step-content">
                                        <h4>Brand Your Space</h4>
                                        <p>Go to <span className="highlight">Settings &gt; Profile</span> to upload your logo and tagline. This branding appears on every invoice you share.</p>
                                    </div>
                                </div>
                                <div className="step-card">
                                    <div className="step-number">02</div>
                                    <div className="step-content">
                                        <h4>Define Products</h4>
                                        <p>Navigate to <span className="highlight">Settings &gt; Products</span>. Create categories (e.g., "Frames") and add your items.</p>
                                    </div>
                                </div>
                                <div className="step-card">
                                    <div className="step-number">03</div>
                                    <div className="step-content">
                                        <h4>Create First Order</h4>
                                        <p>Click <strong>New Order</strong> in the sidebar. Use the single-page form (Desktop) or the 4-step wizard (Mobile).</p>
                                    </div>
                                </div>
                                <div className="step-card">
                                    <div className="step-number">04</div>
                                    <div className="step-content">
                                        <h4>Share Invoice</h4>
                                        <p>After saving, click the <MessageCircle size={14} style={{ display: 'inline' }} /> WhatsApp icon to send a professional bill instantly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            ]
        },
        {
            category: "APP MODULES",
            items: [
                {
                    id: 'dashboard', label: 'Dashboard', icon: Monitor,
                    title: "Dashboard & Analytics", subtitle: "Your business command center.",
                    content: (
                        <div className="doc-article">
                            <h2>Overview Cards</h2>
                            <p>The top row provides a real-time health check of your business:</p>
                            <ul className="feature-list">
                                <li><strong>Net Sales:</strong> Total revenue from orders marked as 'Paid'.</li>
                                <li><strong>Net Profit:</strong> <code>Net Sales - Total Expenses</code>. This is your actual take-home earnings.</li>
                                <li><strong>Success Rate:</strong> The percentage of orders that reach 'Delivered' status without being returned.</li>
                            </ul>
                            <h2>Interactive Charts</h2>
                            <p>The <strong>Revenue vs Expenses</strong> graph visualizes cash flow trends. Hover over any data point to see the exact values for that day.</p>
                        </div>
                    )
                },
                {
                    id: 'orders', label: 'Orders', icon: ShoppingBag,
                    title: "Order Management", subtitle: "Managing the complete lifecycle of a sale.",
                    content: (
                        <div className="doc-article">
                            <h2>Creating Orders</h2>
                            <p>We offer two distinct interfaces depending on your device:</p>
                            <ul>
                                <li><strong>Desktop Mode:</strong> A power-user layout.</li>
                                <li><strong>Mobile Wizard:</strong> A 4-step stepper optimized for phones.</li>
                            </ul>
                            <h2>Statuses</h2>
                            <div className="status-grid">
                                <span className="status-badge new">New Order</span>
                                <span className="arrow">→</span>
                                <span className="status-badge packed">Packed</span>
                                <span className="arrow">→</span>
                                <span className="status-badge dispatched">Dispatched</span>
                                <span className="arrow">→</span>
                                <span className="status-badge delivered">Delivered</span>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod_inventory', label: 'Inventory', icon: Package,
                    title: "Inventory Management", subtitle: "Tracking stock levels.",
                    content: (
                        <div className="doc-article">
                            <p>Inventory in AOF Biz is "Active", meaning it automatically deducts stock when orders are processed.</p>
                        </div>
                    )
                },
                {
                    id: 'expenses', label: 'Expenses', icon: DollarSign,
                    title: "Expense Tracking", subtitle: "Monitor costs and profitability.",
                    content: (
                        <div className="doc-article">
                            <p>Track both operational (one-off) and recurring expenses to get an accurate Net Profit calculation.</p>
                        </div>
                    )
                }
            ]
        },
        {
            category: "SETTINGS DEEP DIVE",
            items: [
                {
                    id: 'settings_root',
                    label: 'Settings',
                    icon: Settings,
                    isFolder: true,
                    children: [
                        {
                            id: 'set_general',
                            label: 'General',
                            icon: Layers,
                            isFolder: true,
                            children: [
                                {
                                    id: 'set_gen_config', label: 'General Configuration',
                                    title: 'General Configuration', subtitle: 'Business identity and defaults.',
                                    content: (
                                        <div className="doc-article">
                                            <h3>Business Identity</h3>
                                            <ul>
                                                <li><strong>Business Name:</strong> Displayed on the sidebar and invoices.</li>
                                                <li><strong>Slogan:</strong> A short tagline appearing below your business name.</li>
                                                <li><strong>Logo:</strong> Upload a square PNG/SVG (max 2MB).</li>
                                            </ul>
                                            <h3>Operational Defaults</h3>
                                            <ul>
                                                <li><strong>Default Delivery Charge:</strong> Automatically added to new orders.</li>
                                                <li><strong>Quotation Expiry:</strong> Validity period for quotes (days).</li>
                                                <li><strong>Print Page Size:</strong> A4, A5, or Letter.</li>
                                            </ul>
                                        </div>
                                    )
                                },
                                {
                                    id: 'set_appearance', label: 'Appearance',
                                    title: 'Appearance & Theme', subtitle: 'Personalize your workspace.',
                                    content: (
                                        <div className="doc-article">
                                            <h3>Theme Mode</h3>
                                            <ul><li>System, Light, or Dark mode.</li></ul>
                                            <h3>Typography</h3>
                                            <p>Choose from Modern Sans (Inter), Elegant Serif (Merriweather), or Tech Mono (Roboto).</p>
                                            <h3>Design Personality</h3>
                                            <p>Select your brand color palette (Signature Red, Emerald Green, Royal Blue).</p>
                                        </div>
                                    )
                                },
                                {
                                    id: 'set_tracking', label: 'Tracking Numbers',
                                    title: 'Tracking Numbers', subtitle: 'Manage courier stickers.',
                                    content: (
                                        <div className="doc-article">
                                            <p>Pre-load tracking numbers (e.g. from a sticker roll). The system assigns them sequentially to orders upon dispatch.</p>
                                        </div>
                                    )
                                },
                                {
                                    id: 'set_curfox', label: 'Curfox Courier Integration',
                                    title: 'Curfox Integration', subtitle: 'Connect to Curfox logistics.',
                                    content: (
                                        <div className="doc-article">
                                            <p>Automate logistics by connecting your Curfox account.</p>
                                            <ul>
                                                <li><strong>Tenant ID:</strong> Your Curfox subdomain.</li>
                                                <li><strong>API Key:</strong> Found in Curfox Settings.</li>
                                            </ul>
                                        </div>
                                    )
                                },
                                {
                                    id: 'set_whatsapp', label: 'WhatsApp Message Templates',
                                    title: 'WhatsApp Templates', subtitle: 'Automate customer communication.',
                                    content: (
                                        <div className="doc-article">
                                            <div className="callout-tip">
                                                <Zap size={16} className="icon" />
                                                <div><strong>Dynamic Variables:</strong> Use <code>{`{{customer_name}}`}</code>, <code>{`{{order_id}}`}</code>, and <code>{`{{total_price}}`}</code> in your templates.</div>
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    id: 'set_sources', label: 'Order Sources',
                                    title: 'Order Sources', subtitle: 'Track where sales come from.',
                                    content: (
                                        <div className="doc-article">
                                            <p>Define channels like "Facebook", "Instagram", or "Walk-in" to analyze your marketing performance.</p>
                                        </div>
                                    )
                                }
                            ]
                        },
                        {
                            id: 'set_backup',
                            label: 'Backup & Data',
                            icon: Database,
                            isFolder: true,
                            children: [
                                {
                                    id: 'backup_cloud', label: 'Google Drive Cloud Backup',
                                    title: 'Cloud Backup', subtitle: 'Secure off-site storage.',
                                    content: (
                                        <div className="doc-article">
                                            <p>Connect Google Drive to create a private <code>AOF_Backups</code> folder. Supports daily/weekly/hourly auto-backups.</p>
                                        </div>
                                    )
                                },
                                {
                                    id: 'backup_manual', label: 'Manual Backup & Restore',
                                    title: 'Manual Backup', subtitle: 'Local export/import.',
                                    content: (
                                        <div className="doc-article">
                                            <p>Download a <code>.json</code> snapshot of your entire business. Essential before major updates or device migration.</p>
                                        </div>
                                    )
                                },
                                {
                                    id: 'backup_health', label: 'Data Health Check',
                                    title: 'Data Health Check', subtitle: 'Diagnostic tool.',
                                    content: (
                                        <div className="doc-article">
                                            <p>Scans your database for inconsistencies like orphaned expenses or invalid dates. Run this if analytics seem incorrect.</p>
                                        </div>
                                    )
                                },
                                {
                                    id: 'backup_danger', label: 'Danger Zone',
                                    title: 'Danger Zone', subtitle: 'Irreversible actions.',
                                    content: (
                                        <div className="doc-article">
                                            <div className="trouble-card">
                                                <h4>Clear All Data</h4>
                                                <p>This will wipe the entire application database. This action cannot be undone unless you have a backup.</p>
                                            </div>
                                        </div>
                                    )
                                }
                            ]
                        },
                        {
                            id: 'set_products',
                            label: 'Products',
                            icon: Package,
                            title: 'Product Settings',
                            subtitle: 'Manage categories and definitions.',
                            content: (
                                <div className="doc-article">
                                    <p>Configure product categories and default attributes. Use the main <strong>Products</strong> module to add actual items.</p>
                                </div>
                            )
                        },
                        {
                            id: 'set_expenses',
                            label: 'Expenses',
                            icon: DollarSign,
                            title: 'Expense Settings',
                            subtitle: 'Configure expense types.',
                            content: (
                                <div className="doc-article">
                                    <p>Define standard expense categories (e.g. "Packaging", "Travel") to standardize your cost tracking.</p>
                                </div>
                            )
                        },
                        {
                            id: 'set_inventory',
                            label: 'Inventory',
                            icon: ShoppingBag,
                            title: 'Inventory Settings',
                            subtitle: 'Stock thresholds.',
                            content: (
                                <div className="doc-article">
                                    <p>Set global reorder levels and default stock warnings.</p>
                                </div>
                            )
                        },
                        {
                            id: 'set_premium',
                            label: 'Premium',
                            icon: Crown,
                            isFolder: true,
                            children: [
                                {
                                    id: 'prem_sync', label: 'Multi-Device Cloud Sync',
                                    title: 'Cloud Sync', subtitle: 'Sync across devices.',
                                    content: (
                                        <div className="doc-article">
                                            <p>Real-time synchronization between desktop and mobile using a centralized cloud database.</p>
                                        </div>
                                    )
                                },
                                {
                                    id: 'prem_multi', label: 'Multi-Business Management',
                                    title: 'Multi-Business', subtitle: 'Manage multiple entities.',
                                    content: (
                                        <div className="doc-article">
                                            <p>Switch between different business profiles within a single app instance.</p>
                                        </div>
                                    )
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'updates',
                    label: 'Updates',
                    icon: RefreshCw,
                    title: "App Updates",
                    subtitle: "Latest features and changes.",
                    content: (
                        <div className="doc-article">
                            <p>Check here for changelogs and update availability.</p>
                        </div>
                    )
                }
            ]
        },
        {
            category: "SUPPORT",
            items: [
                {
                    id: 'faq', label: 'FAQs', icon: HelpCircle,
                    title: "FAQs", subtitle: "Common questions.",
                    content: <div className="doc-article"><p>Answers to common questions.</p></div>
                },
                {
                    id: 'trouble', label: 'Troubleshooting', icon: AlertTriangle,
                    title: "Troubleshooting", subtitle: "Fixing common issues.",
                    content: <div className="doc-article"><p>Solutions for known problems.</p></div>
                },
                {
                    id: 'glossary', label: 'Glossary', icon: Book,
                    title: "Glossary", subtitle: "Terms used.",
                    content: <div className="doc-article"><p>Definitions of terms.</p></div>
                }
            ]
        }
    ]

    // Flatten for search and content lookup
    const allItems = useMemo(() => {
        const flatten = (items) => {
            let result = []
            items.forEach(item => {
                if (item.content) result.push(item)
                if (item.children) result = result.concat(flatten(item.children))
            })
            return result
        }
        return DOCS_STRUCTURE.flatMap(cat => flatten(cat.items))
    }, [])

    const activeItem = useMemo(() => {
        return allItems.find(i => i.id === activeId) || allItems[0]
    }, [activeId, allItems])

    // Filter Navigation based on search
    const filteredNav = useMemo(() => {
        if (searchTerm) {
            const results = allItems.filter(item =>
                item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            return [{ category: "SEARCH RESULTS", items: results }]
        }
        return DOCS_STRUCTURE
    }, [searchTerm, allItems])

    // Dynamic TOC Generation
    useEffect(() => {
        const timer = setTimeout(() => {
            const contentArea = document.querySelector('.help-content-area')
            if (!contentArea) return

            const headings = contentArea.querySelectorAll('h2, h3')
            const items = []

            headings.forEach((heading, index) => {
                const text = heading.innerText
                const id = toKebabCase(text) + '-' + index
                heading.id = id
                items.push({ id, text, level: heading.tagName.toLowerCase() })
            })

            setTocItems(items)
        }, 150)
        return () => clearTimeout(timer)
    }, [activeId])

    const toKebabCase = (str) => {
        return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }

    const scrollToHeading = (id) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    // Recursive Sidebar Item Renderer
    const SidebarItem = ({ item, level = 0 }) => {
        const hasChildren = item.children && item.children.length > 0
        const isExpanded = expandedNav[item.id]
        const isActive = activeId === item.id

        // Style for indentation
        const paddingLeft = `${0.75 + (level * 0.8)}rem`

        return (
            <>
                <div
                    className={`nav-item ${isActive ? 'active' : ''} ${hasChildren ? 'folder' : 'leaf'}`}
                    style={{ paddingLeft }}
                    onClick={(e) => {
                        if (hasChildren) {
                            toggleNav(item.id, e)
                        } else {
                            setActiveId(item.id)
                        }
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                        {hasChildren ? (
                            isExpanded ? <ChevronDown size={14} className="folder-icon" /> : <ChevronRight size={14} className="folder-icon" />
                        ) : (
                            item.icon ? <item.icon size={16} className="nav-icon" /> : <div style={{ width: 16 }} />
                        )}
                        <span className="nav-label">{item.label}</span>
                    </div>
                </div>
                {hasChildren && isExpanded && (
                    <div className="nav-children">
                        {item.children.map(child => (
                            <SidebarItem key={child.id} item={child} level={level + 1} />
                        ))}
                    </div>
                )}
            </>
        )
    }


    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-family)' }}>
            <style>{`
                /* DOCS SPECIFIC STYLES THAT SHOULD NOT AFFECT GLOBAL THEME */
                .help-search-input {
                    width: 100%;
                    padding: 0.6rem 0.8rem 0.6rem 2.2rem;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius);
                    background: var(--bg-card); /* Consistent with app cards */
                    color: var(--text-primary);
                    font-size: 0.9rem;
                    outline: none;
                    transition: all 0.2s;
                }
                .help-search-input:focus {
                    border-color: var(--accent-primary);
                    background: var(--bg-primary);
                    box-shadow: 0 0 0 1px rgba(var(--accent-rgb), 0.1);
                }
                
                .nav-category {
                    margin-bottom: 2rem;
                }
                .nav-cat-title {
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    color: var(--text-muted);
                    margin-bottom: 0.5rem;
                    padding-left: 1rem;
                    text-transform: uppercase;
                }
                
                .nav-item {
                    display: flex;
                    align-items: center;
                    padding: 0.6rem 1rem;
                    cursor: pointer;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    transition: all 0.1s;
                    user-select: none;
                    margin: 2px 8px; /* Added margins for card-like feel */
                    border-radius: var(--radius);
                }
                .nav-item:hover {
                    background: rgba(255, 255, 255, 0.05); /* Subtle hover */
                    color: var(--text-primary);
                }
                .nav-item.active {
                    background: rgba(var(--accent-rgb), 0.1);
                    color: var(--accent-primary);
                    font-weight: 600;
                }
                .nav-item.folder {
                    font-weight: 500;
                }
                .folder-icon {
                    color: var(--text-muted);
                    opacity: 0.7;
                    transition: transform 0.2s;
                }
                .nav-children {
                    position: relative;
                }
                
                /* CONTENT STYLING */
                .doc-article h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 2.5rem 0 1.5rem;
                    color: var(--text-primary);
                }
                .doc-article h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 2rem 0 1rem;
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                }
                .doc-article h4 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    margin: 0 0 0.5rem;
                    color: var(--text-primary);
                }
                .doc-article p, .doc-article ul, .doc-article ol {
                    font-size: 1rem; /* Standard font size */
                    line-height: 1.6;
                    color: var(--text-secondary);
                    margin-bottom: 1rem;
                }
                .doc-article ul, .doc-article ol {
                    padding-left: 1.5rem;
                }
                .doc-article li {
                    margin-bottom: 0.5rem;
                }
                .highlight {
                    background: rgba(var(--accent-rgb), 0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                    color: var(--accent-primary);
                    font-weight: 600;
                    font-size: 0.9em;
                }

                .step-card {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                    position: relative;
                }
                .step-number {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    color: var(--accent-primary);
                    flex-shrink: 0;
                }

                .callout-tip {
                    background: rgba(var(--accent-rgb), 0.05);
                    border-left: 4px solid var(--accent-primary);
                    padding: 1.5rem;
                    border-radius: 0 var(--radius) var(--radius) 0;
                    display: flex;
                    gap: 1rem;
                    margin: 1.5rem 0;
                }

                /* TOC STYLING */
                .toc-link {
                    display: block;
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    text-decoration: none;
                    margin-bottom: 0.75rem;
                    padding-left: 0.75rem;
                    border-left: 2px solid transparent; /* default */
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .toc-link:hover {
                    color: var(--accent-primary);
                    border-left-color: var(--border-color);
                }
            `}</style>

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 200px', flex: 1, minHeight: 0 }}>
                {/* --- LEFT SIDEBAR (Standard Appearance) --- */}
                <div style={{
                    borderRight: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto'
                }}>
                    <div style={{ padding: '1.5rem 1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <BookOpen size={24} color="var(--accent-primary)" /> Docs
                        </h2>
                        <div style={{ position: 'relative' }}>
                            <Search className="search-icon-sm" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: 16 }} />
                            <input
                                className="help-search-input"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        {filteredNav.map((cat, idx) => (
                            <div key={idx} className="nav-category">
                                <div className="nav-cat-title">{cat.category}</div>
                                {cat.items.map(item => (
                                    <SidebarItem key={item.id} item={item} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- MAIN CONTENT (Standard Page Layout) --- */}
                <div className="help-content-area" style={{ padding: '2rem 3rem', overflowY: 'auto' }}>
                    <div className="breadcrumbs" style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <span>Help</span>
                        <ChevronRight size={14} />
                        <span>{activeItem.title ? "Guide" : "Docs"}</span>
                        <ChevronRight size={14} />
                        <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{activeItem.label}</span>
                    </div>

                    <div className="doc-header" style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>{activeItem.title}</h1>
                        <div style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>{activeItem.subtitle}</div>
                    </div>

                    {activeItem.content}

                    <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Was this helpful? <span style={{ color: 'var(--accent-primary)', cursor: 'pointer', marginLeft: '0.5rem', fontWeight: 600 }}>Yes</span> • <span style={{ marginLeft: '0.5rem', cursor: 'pointer' }}>No</span>
                    </div>
                </div>

                {/* --- RIGHT TOC (Subtle) --- */}
                <div style={{ padding: '2rem 1rem', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>On this page</div>
                    {tocItems.length === 0 && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No subsections</span>}
                    {tocItems.map(item => (
                        <a
                            key={item.id}
                            className="toc-link"
                            onClick={() => scrollToHeading(item.id)}
                            style={{
                                paddingLeft: item.level === 'h3' ? '1.25rem' : '0.5rem',
                                color: item.level === 'h2' ? 'var(--text-primary)' : 'var(--text-secondary)'
                            }}
                        >
                            {item.text}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default HelpDocs
