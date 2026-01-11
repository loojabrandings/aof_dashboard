import { AlertCircle, AlertTriangle, Info } from 'lucide-react'

const FormValidation = ({ message, type = 'error', style = {} }) => {
    if (!message) return null

    const getStyles = () => {
        switch (type) {
            case 'warning':
                return {
                    color: 'var(--warning)',
                    icon: <AlertTriangle size={14} />
                }
            case 'info':
                return {
                    color: 'var(--accent-primary)',
                    icon: <Info size={14} />
                }
            default:
                return {
                    color: 'var(--danger)',
                    icon: <AlertCircle size={14} />
                }
        }
    }

    const { color, icon } = getStyles()

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginTop: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: 500,
                color,
                animation: 'fadeIn 0.2s ease-out',
                ...style
            }}
        >
            {icon}
            <span>{message}</span>
        </div>
    )
}

export default FormValidation
