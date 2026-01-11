import { useState, useEffect } from 'react'
import { X, Package, RefreshCw, Check, Search } from 'lucide-react'
import CustomDropdown from './Common/CustomDropdown'
import CustomDatePicker from './Common/CustomDatePicker'
import FormValidation from './FormValidation'
import { getExpenseCategories, getInventoryCategories, getInventory } from '../utils/storage'
import { toSentenceCase } from '../utils/textUtils'
import { useToast } from './Toast/ToastContext'

const ExpenseForm = ({ expense, onClose, onSave, inventory, onUpdateInventory }) => {
  const { addToast } = useToast()
  const [expenseCategories, setExpenseCategories] = useState({ categories: [] })
  const [inventoryCategories, setInventoryCategories] = useState({ categories: [] })
  const [inventoryItems, setInventoryItems] = useState([])
  const [addToInventory, setAddToInventory] = useState(true) // Default checked
  const [isSaving, setIsSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getErrorStyle = (fieldName) => {
    if (validationErrors[fieldName]) {
      return {
        borderColor: 'var(--danger)',
        boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.2)'
      }
    }
    return {}
  }

  // Initialize form data
  const getInitialFormData = () => {
    if (expense) {
      return {
        date: expense.date || new Date().toISOString().split('T')[0],
        item: expense.item || expense.description || '',
        category: expense.category || '',
        quantity: expense.quantity || 1,
        unitCost: expense.unitCost || 0,
        total: expense.total || expense.amount || 0,
        inventoryItemId: expense.inventoryItemId || null
      }
    }
    return {
      date: new Date().toISOString().split('T')[0],
      item: '',
      category: '',
      quantity: 1,
      unitCost: 0,
      total: 0,
      inventoryItemId: null
    }
  }

  const [formData, setFormData] = useState(getInitialFormData())

  // Load categories and inventory on mount
  useEffect(() => {
    const loadData = async () => {
      const [expCategories, invCategories, invItems] = await Promise.all([
        getExpenseCategories(),
        getInventoryCategories(),
        getInventory()
      ])
      setExpenseCategories(expCategories)
      setInventoryCategories(invCategories)
      setInventoryItems(invItems)
    }
    loadData()
  }, [])

  // Filter inventory items by category
  const getFilteredInventoryItems = () => {
    if (!formData.category) return []
    return inventoryItems.filter(item => item.category === formData.category)
  }

  const getFilteredItems = () => {
    return getFilteredInventoryItems()
  }

  // Items under selected expense category (when Add to Inventory is OFF)
  const getExpenseCategoryItems = () => {
    if (!formData.category) return []
    const cat = (expenseCategories.categories || []).find(c => c.name === formData.category)
    return Array.isArray(cat?.items) ? cat.items : []
  }

  const getFilteredExpenseItems = () => {
    return getExpenseCategoryItems()
  }

  // Update form data when expense changes (for edit mode)
  useEffect(() => {
    if (expense) {
      const initialData = {
        date: expense.date || new Date().toISOString().split('T')[0],
        item: expense.item || expense.description || '',
        category: expense.category || '',
        quantity: expense.quantity || 1,
        unitCost: expense.unitCost || 0,
        total: expense.total || expense.amount || 0,
        inventoryItemId: expense.inventoryItemId || null
      }
      setFormData(initialData)
      setTotalManuallyEdited(false)
      // Determine if this expense is linked to inventory
      if (expense.inventoryItemId) {
        setAddToInventory(true)
      }
    }
  }, [expense])

  // Handle Esc key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // Handle click outside to close dropdown
  // Auto-calculate total when quantity or unitCost changes (only if total wasn't manually edited)
  const [totalManuallyEdited, setTotalManuallyEdited] = useState(false)

  useEffect(() => {
    if (!totalManuallyEdited) {
      const qty = parseFloat(formData.quantity) || 0
      const cost = parseFloat(formData.unitCost) || 0
      const calculatedTotal = qty * cost
      // Only update if the calculated total is different to avoid unnecessary re-renders
      if (parseFloat(formData.total) !== calculatedTotal) {
        setFormData(prev => ({ ...prev, total: calculatedTotal }))
      }
    }
  }, [formData.quantity, formData.unitCost, totalManuallyEdited, formData.total])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'total') {
      setTotalManuallyEdited(true)
      setFormData(prev => ({ ...prev, [name]: value }))
    } else if (name === 'quantity' || name === 'unitCost') {
      // Reset manual edit flag when quantity or unit cost changes
      setTotalManuallyEdited(false)
      setFormData(prev => ({ ...prev, [name]: value }))
    } else if (name === 'category') {
      // Reset item when category changes
      setFormData(prev => ({ ...prev, [name]: value, item: '', inventoryItemId: null }))
      setItemSearchQuery('')
    } else {
      let finalValue = value
      if (name === 'item') {
        finalValue = toSentenceCase(value)
      }
      setFormData(prev => ({ ...prev, [name]: finalValue }))
    }
  }

  const handleToggleAddToInventory = () => {
    setAddToInventory(!addToInventory)
    // Reset category and item when toggling
    setFormData({ ...formData, category: '', item: '', inventoryItemId: null })
  }

  const getFilteredCategories = () => {
    return addToInventory ? inventoryCategories.categories : expenseCategories.categories
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    const errors = {}
    if (!formData.date) errors.date = 'Date is required'
    if (!formData.item?.trim()) errors.item = 'Item description is required'
    if (!formData.category) errors.category = 'Category is required'
    if (parseFloat(formData.total) <= 0) errors.total = 'Amount must be greater than 0'

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      addToast(Object.values(errors)[0], 'warning')
      return
    }

    setIsSaving(true)
    try {
      const expenseData = {
        date: formData.date,
        description: formData.item,
        item: formData.item,
        category: formData.category,
        quantity: parseFloat(formData.quantity) || 0,
        unitCost: parseFloat(formData.unitCost) || 0,
        amount: parseFloat(formData.total) || 0,
        total: parseFloat(formData.total) || 0,
        inventoryItemId: addToInventory && formData.inventoryItemId ? formData.inventoryItemId : null,
        id: expense?.id || Date.now().toString()
      }

      // Update inventory stock if linked to inventory item
      if (addToInventory && formData.inventoryItemId && inventory && onUpdateInventory) {
        const item = inventory.find(inv => inv.id === formData.inventoryItemId)
        if (item) {
          const quantity = parseFloat(formData.quantity) || 0
          const updatedInventory = inventory.map(inv =>
            inv.id === formData.inventoryItemId
              ? { ...inv, currentStock: inv.currentStock + quantity }
              : inv
          )
          const { saveInventory } = await import('../utils/storage')
          await saveInventory(updatedInventory)
          onUpdateInventory(updatedInventory)
        }
      }

      await onSave(expenseData)
      onClose()
    } catch (error) {
      console.error('Error saving expense:', error)
      addToast('Failed to save expense', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: isMobile ? '100%' : '500px' }}>
        <div className="modal-header" style={isMobile ? { flexDirection: 'column', alignItems: 'stretch', padding: '0.75rem 1rem' } : {}}>
          {isMobile ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {expense ? 'Edit Expense' : 'Add New Expense'}
              </span>
              <button
                className="modal-close"
                onClick={onClose}
                style={{ position: 'static', color: 'var(--text-primary)', background: 'var(--bg-secondary)', borderRadius: '50%', padding: '0.35rem' }}
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <h2 className="modal-title">
                {expense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <button className="modal-close" onClick={onClose}>
                <X size={20} />
              </button>
            </>
          )}
        </div>

        <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <CustomDatePicker
                type="date"
                name="date"
                error={validationErrors.date}
                value={formData.date}
                onChange={(val) => {
                  handleChange({ target: { name: 'date', value: val } })
                  if (validationErrors.date) setValidationErrors(prev => ({ ...prev, date: null }))
                }}
              />
              <FormValidation message={validationErrors.date} />
            </div>

            {/* Add to Inventory Toggle */}
            <div className="form-group">
              <button
                type="button"
                onClick={handleToggleAddToInventory}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  border: `2px solid ${addToInventory ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius)',
                  backgroundColor: addToInventory ? 'var(--accent-primary)' : 'var(--bg-card)',
                  color: addToInventory ? 'white' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <Package size={18} />
                <span>{addToInventory ? 'Add to Inventory (Active)' : 'Add to Inventory (Inactive)'}</span>
              </button>
            </div>

            <div className="form-group">
              <CustomDropdown
                label="Category *"
                options={getFilteredCategories().map((cat) => ({ value: cat.name, label: cat.name }))}
                value={formData.category}
                onChange={(val) => {
                  setFormData(prev => ({ ...prev, category: val, item: '', inventoryItemId: null }))
                  if (validationErrors.category) setValidationErrors(prev => ({ ...prev, category: null }))
                }}
                error={!!validationErrors.category}
                placeholder="Select category"
              />
              <FormValidation message={validationErrors.category} />
            </div>

            <div className="form-group">
              <label className="form-label">Item *</label>
              {addToInventory ? (
                <CustomDropdown
                  options={getFilteredItems().map((item) => ({
                    value: item.id,
                    label: item.itemName,
                    sublabel: `Stock: ${item.currentStock}`
                  }))}
                  value={formData.inventoryItemId || ''}
                  onChange={(selectedId) => {
                    const items = getFilteredItems()
                    const matchedItem = items.find(i => i.id === selectedId)
                    if (matchedItem) {
                      setFormData({
                        ...formData,
                        item: matchedItem.itemName,
                        inventoryItemId: matchedItem.id,
                        unitCost: matchedItem.unitCost || formData.unitCost
                      })
                    } else {
                      setFormData({ ...formData, item: '', inventoryItemId: null })
                    }
                    if (validationErrors.item) setValidationErrors(prev => ({ ...prev, item: null }))
                  }}
                  error={!!validationErrors.item}
                  placeholder="Select inventory item"
                  searchable={true}
                />
              ) : (
                <CustomDropdown
                  options={getFilteredExpenseItems().map((item) => ({
                    value: item.name,
                    label: item.name
                  }))}
                  value={formData.item}
                  onChange={(selectedName) => {
                    setFormData({ ...formData, item: selectedName, inventoryItemId: null })
                    if (validationErrors.item) setValidationErrors(prev => ({ ...prev, item: null }))
                  }}
                  error={!!validationErrors.item}
                  placeholder="Select item"
                  searchable={getFilteredExpenseItems().length > 5}
                />
              )}
              <FormValidation message={validationErrors.item} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-input"
                  value={formData.quantity === 0 ? '' : formData.quantity}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const numValue = parseFloat(e.target.value) || 0
                    setFormData(prev => ({ ...prev, quantity: numValue }))
                  }}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Cost</label>
                <input
                  type="number"
                  name="unitCost"
                  className="form-input"
                  value={formData.unitCost === 0 ? '' : formData.unitCost}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const numValue = parseFloat(e.target.value) || 0
                    setFormData(prev => ({ ...prev, unitCost: numValue }))
                  }}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Total Amount *</label>
              <input
                type="number"
                name="total"
                className="form-input"
                style={getErrorStyle('total')}
                value={formData.total === 0 ? '' : formData.total}
                onChange={(e) => {
                  handleChange(e)
                  if (validationErrors.total) setValidationErrors(prev => ({ ...prev, total: null }))
                }}
                min="0"
                step="0.01"
                required
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                Auto-calculated (Qty × Unit Cost). You can edit if needed.
              </small>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw size={18} className="animate-spin" style={{ marginRight: '0.5rem' }} />
                  Saving...
                </>
              ) : (
                expense ? 'Update Expense' : 'Add Expense'
              )}
            </button>
          </div>
        </form>
      </div >
    </div >
  )
}

export default ExpenseForm
