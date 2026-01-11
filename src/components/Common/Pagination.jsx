import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    onItemsPerPageChange,
    className = ''
}) => {
    const [goToPage, setGoToPage] = useState('')

    if (totalItems === 0) return null

    // Calculate range
    const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    const handleGoTo = (e) => {
        if (e.key === 'Enter') {
            const page = parseInt(goToPage)
            if (page >= 1 && page <= totalPages) {
                onPageChange(page)
                setGoToPage('')
            }
        }
    }

    const handleBlur = () => {
        const page = parseInt(goToPage)
        if (page >= 1 && page <= totalPages) {
            onPageChange(page)
            setGoToPage('')
        }
    }

    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5
        let start = Math.max(1, currentPage - 2)
        let end = Math.min(totalPages, start + (maxVisible - 1))

        if (end - start < (maxVisible - 1)) {
            start = Math.max(1, end - (maxVisible - 1))
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }
        return pages
    }

    return (
        <div className={`pagination-container ${className}`} style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            gap: '1rem'
        }}>
            <style>{`
                @media (max-width: 768px) {
                    .pagination-container {
                        flex-direction: column;
                        justify-content: center !important;
                        gap: 1.5rem !important;
                    }
                    .pagination-info {
                        text-align: center;
                        width: 100%;
                        order: 2; /* Put info at bottom on mobile? Or Top? Usually Bottom or Top. Let's keep natural order (Top) but center. */
                        order: 1;
                    }
                    .pagination-wrapper {
                        justify-content: center !important;
                        width: 100%;
                        flex-direction: column;
                        gap: 1rem !important;
                        order: 2;
                    }
                    .pagination-separator {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Left Side: Showing X to Y of Z */}
            <div className="pagination-info" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Showing <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{startItem}</span> to <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{endItem}</span> of <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{totalItems}</span> results
            </div>

            {/* Right Side: Pagination Controls */}
            <div className="pagination-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>

                {/* Nav Group */}
                <div className="pagination-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Previous Button */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.currentTarget.blur()
                            onPageChange(currentPage - 1)
                        }}
                        disabled={currentPage === 1}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: currentPage === 1 ? 0.5 : 1
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Page Numbers */}
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {getPageNumbers().map(pageNum => (
                            <button
                                key={pageNum}
                                type="button"
                                onClick={(e) => {
                                    e.currentTarget.blur()
                                    onPageChange(pageNum)
                                }}
                                style={{
                                    minWidth: '32px',
                                    height: '32px',
                                    padding: '0 0.5rem',
                                    borderRadius: '50%',
                                    border: currentPage === pageNum ? '1px solid var(--accent-primary)' : '1px solid transparent',
                                    backgroundColor: 'transparent',
                                    color: currentPage === pageNum ? 'var(--accent-primary)' : 'var(--text-primary)',
                                    fontSize: '0.875rem',
                                    fontWeight: currentPage === pageNum ? 600 : 400,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.currentTarget.blur()
                            onPageChange(currentPage + 1)
                        }}
                        disabled={currentPage === totalPages}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: currentPage === totalPages ? 0.5 : 1
                        }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Separator between Nav and Settings */}
                <div className="pagination-separator" style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 0.25rem' }} />

                {/* Settings Group */}
                <div className="pagination-settings" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

                    {/* Items Per Page Dropdown */}
                    {onItemsPerPageChange && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        onItemsPerPageChange(Number(e.target.value))
                                        onPageChange(1) // Reset to page 1 on limit change
                                    }}
                                    style={{
                                        appearance: 'none',
                                        padding: '0.35rem 2rem 0.35rem 0.75rem',
                                        borderRadius: '20px',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: 'transparent',
                                        fontSize: '0.875rem',
                                        color: 'var(--text-primary)',
                                        cursor: 'pointer',
                                        outline: 'none',
                                        minWidth: '70px'
                                    }}
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                </select>
                                <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                            </div>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/ page</span>
                        </div>
                    )}

                    {/* Separator between Dropdown and GoTo (only if Dropdown exists) */}
                    {onItemsPerPageChange && (
                        <div className="pagination-separator" style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 0rem' }} />
                    )}

                    {/* Go To Page */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        <span>Go to</span>
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={goToPage}
                            onChange={(e) => setGoToPage(e.target.value)}
                            onKeyDown={handleGoTo}
                            onBlur={handleBlur}
                            style={{
                                width: '50px',
                                padding: '0.35rem',
                                borderRadius: '20px',
                                border: '1px solid var(--border-color)',
                                textAlign: 'center',
                                fontSize: '0.875rem',
                                outline: 'none',
                                backgroundColor: 'transparent',
                                color: 'var(--text-primary)'
                            }}
                        />
                        <span>Page</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pagination
