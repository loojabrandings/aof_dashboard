import { useState, useEffect, useRef } from 'react'
import { getTrackingNumbers, getOrders } from '../utils/storage'
import { markTrackingNumberAsUsed } from '../utils/storage'

const TrackingNumberInput = ({ value, onChange, onBlur, disabled, required }) => {
  const [suggestions, setSuggestions] = useState([])
  const [inputValue, setInputValue] = useState(value || '')
  const [allTrackingNumbers, setAllTrackingNumbers] = useState([])
  const [assignedTrackingNumbers, setAssignedTrackingNumbers] = useState(new Set())
  const inputRef = useRef(null)

  // Load tracking numbers and orders on mount
  useEffect(() => {
    const loadData = async () => {
      const [trackingNumbers, orders] = await Promise.all([
        getTrackingNumbers(),
        getOrders()
      ])

      // Get set of tracking numbers already assigned to orders
      const assigned = new Set()
      orders.forEach(order => {
        if (order.trackingNumber) {
          assigned.add(order.trackingNumber.toString())
        }
      })
      setAssignedTrackingNumbers(assigned)

      // Filter only available tracking numbers (not marked as used AND not assigned to orders)
      const available = trackingNumbers.filter(tn => {
        const tnNumber = tn.number?.toString() || ''
        return tn.status === 'available' && !assigned.has(tnNumber)
      })
      setAllTrackingNumbers(available)
    }
    loadData()
  }, [])

  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  const handleInputChange = async (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(e)

    // Extract digits from the input
    const digitsOnly = newValue.replace(/\D/g, '')

    // Check if user typed at least 3 digits
    if (digitsOnly.length >= 3) {
      const lastThreeDigits = digitsOnly.slice(-3)

      // Filter tracking numbers where last 3 digits match and are not assigned
      const matching = allTrackingNumbers.filter(tn => {
        const tnNumber = tn.number?.toString() || ''
        // Skip if already assigned to an order
        if (assignedTrackingNumbers.has(tnNumber)) {
          return false
        }
        // Extract digits from tracking number
        const tnDigits = tnNumber.replace(/\D/g, '')
        return tnDigits.length >= 3 && tnDigits.slice(-3) === lastThreeDigits
      })

      if (matching.length > 0) {
        setSuggestions(matching.map(tn => tn.number))
      } else {
        setSuggestions([])
      }

      // Check if the current value matches a suggestion (handling datalist selection)
      const exactMatch = matching.find(tn => tn.number === newValue)
      if (exactMatch) {
        await markTrackingNumberAsUsed(newValue)
        setAllTrackingNumbers(prev => prev.filter(tn => tn.number?.toString() !== newValue))
        setAssignedTrackingNumbers(prev => new Set([...prev, newValue]))
        setSuggestions([]) // Clear suggestions
      }

    } else {
      setSuggestions([])
    }
  }

  const handleBlur = () => {
    if (onBlur) {
      onBlur({ target: { name: 'trackingNumber', value: inputValue } })
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        name="trackingNumber"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
        className="form-input"
        placeholder="Type last 3 digits for smart suggestions..."
        style={{ width: '100%' }}
        list="tracking-number-suggestions"
        autoComplete="off"
      />
      <datalist id="tracking-number-suggestions">
        {suggestions.map((suggestion) => (
          <option key={suggestion} value={suggestion}>Available</option>
        ))}
      </datalist>
    </div>
  )
}

export default TrackingNumberInput

