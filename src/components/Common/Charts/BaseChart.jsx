import React from 'react'
import { ResponsiveContainer } from 'recharts'

/**
 * Base wrapper for all charts to ensure consistent sizing and responsiveness.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The specific Recharts component (BarChart, AreaChart, etc.)
 * @param {string|number} [props.height=260] - Height of the chart container
 * @param {string} [props.className] - Optional class name
 * @param {Object} [props.style] - Optional inline style object for the container div
 */
const BaseChart = ({ children, height = 260, className = '', style = {} }) => {
    return (
        <div style={{ width: '100%', height: height, ...style }} className={className}>
            <ResponsiveContainer width="100%" height="100%">
                {children}
            </ResponsiveContainer>
        </div>
    )
}

export default BaseChart
