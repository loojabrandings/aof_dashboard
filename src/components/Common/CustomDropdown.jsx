import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Check, X } from 'lucide-react'
import { useTheme } from '../ThemeContext'

const CustomDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  error,
  disabled = false,
  searchable = false,
  className = '',
  style = {},
  isLocked = false,
  lockIcon: LockIcon,
  renderOption
}) => {
  const { effectiveTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  const filteredOptions = searchable
    ? options.filter(opt =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : options

  const handleSelect = (option) => {
    if (disabled || isLocked) return
    onChange(option.value)
    setIsOpen(false)
    setSearchTerm('')
  }

  const toggleDropdown = () => {
    if (disabled || isLocked) return
    setIsOpen(!isOpen)
    if (!isOpen) setSearchTerm('')
  }

  return (
    <div
      className={`custom-dropdown-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        zIndex: isOpen ? '10000' : '1',
        ...style
      }}
      ref={dropdownRef}
    >
      {label && <label className="form-label">{label}</label>}

      <div
        className={`custom-dropdown-trigger ${isOpen ? 'open' : ''} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''} ${isLocked ? 'locked' : ''}`}
        onClick={toggleDropdown}
      >
        <div className="trigger-content">
          {isLocked && LockIcon && <LockIcon size={14} className="lock-icon" />}
          <span className={`selected-value ${!selectedOption ? 'placeholder' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown size={18} className={`chevron-icon ${isOpen ? 'rotate' : ''}`} />
      </div>

      {isOpen && (
        <div
          className="custom-dropdown-menu"
          style={{ zIndex: 10001 }}
        >
          {searchable && (
            <div className="dropdown-search">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <X
                  size={16}
                  className="clear-search"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSearchTerm('')
                  }}
                />
              )}
            </div>
          )}

          <div className="dropdown-options">
            {filteredOptions.length === 0 ? (
              <div className="no-options">No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`dropdown-option ${option.value === value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  {renderOption ? (
                    renderOption(option)
                  ) : (
                    <div className="option-content">
                      <div className="option-label-group">
                        <span className="option-label">{option.label}</span>
                        {option.sublabel && <span className="option-sublabel">{option.sublabel}</span>}
                      </div>
                      {option.value === value && <Check size={16} className="check-icon" />}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        .custom-dropdown-container {
          position: relative;
          width: 100%;
        }

        .custom-dropdown-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.85rem;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 42px;
        }

        .custom-dropdown-trigger:hover:not(.disabled):not(.locked) {
          border-color: var(--accent-primary);
          background-color: var(--bg-card-hover);
        }

        .custom-dropdown-trigger.open {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(255, 46, 54, 0.1);
        }

        .custom-dropdown-trigger.error {
          border-color: var(--danger);
        }

        .custom-dropdown-trigger.disabled {
          cursor: not-allowed;
          opacity: 0.6;
          background-color: var(--bg-secondary);
        }

        .custom-dropdown-trigger.locked {
          cursor: not-allowed;
          position: relative;
        }

        .trigger-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          overflow: hidden;
        }

        .lock-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .selected-value {
          font-size: 0.9rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .selected-value.placeholder {
          color: var(--text-muted);
        }

        .chevron-icon {
          color: var(--text-muted);
          transition: transform 0.2s ease;
          flex-shrink: 0;
          margin-left: 0.5rem;
        }

        .chevron-icon.rotate {
          transform: rotate(180deg);
        }

        .custom-dropdown-menu {
          position: absolute;
          top: calc(100% + 5px);
          left: 0;
          right: 0;
          background-color: ${effectiveTheme === 'dark' ? '#1a1a1a' : '#ffffff'};
          border: 1px solid var(--border-color);
          border-radius: var(--radius);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          animation: dropdownFadeIn 0.2s ease-out;
        }

        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-search {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          border-bottom: 1px solid var(--border-color);
          background-color: rgba(255, 255, 255, 0.03);
          gap: 0.5rem;
        }

        .search-icon {
          color: var(--text-muted);
        }

        .dropdown-search input {
          flex: 1 !important;
          background: transparent !important;
          border: none !important;
          color: var(--text-primary) !important;
          font-size: 0.875rem !important;
          padding: 0 !important;
          outline: none !important;
          box-shadow: none !important;
        }

        .clear-search {
          color: var(--text-muted);
          cursor: pointer;
        }

        .dropdown-options {
          max-height: 250px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(155, 155, 155, 0.2) transparent;
        }

        .dropdown-options::-webkit-scrollbar {
          width: 3px;
        }

        .dropdown-options::-webkit-scrollbar-track {
          background: transparent;
        }

        .dropdown-options::-webkit-scrollbar-thumb {
          background: rgba(155, 155, 155, 0.15);
          border-radius: 10px;
        }

        .dropdown-options::-webkit-scrollbar-thumb:hover {
          background: rgba(155, 155, 155, 0.3);
        }

        .dropdown-option {
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .dropdown-option:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .dropdown-option.selected {
          background-color: rgba(255, 46, 54, 0.1);
        }

        .option-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .option-label-group {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .option-label {
          font-size: 0.875rem;
          color: var(--text-primary);
        }

        .option-sublabel {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .check-icon {
          color: var(--accent-primary);
        }

        .no-options {
          padding: 1rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  )
}

export default CustomDropdown
