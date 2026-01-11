import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import BaseChart from './BaseChart'
import { chartTheme, CustomTooltip } from '../../Reports/ChartConfig'

/**
 * Standardized Area Chart component.
 * 
 * @param {Object} props
 * @param {Array} props.data - Chart data array
 * @param {string} props.dataKey - Key for the data value
 * @param {string} props.xAxisKey - Key for the X-axis label (default: 'date')
 * @param {string} props.color - Hex color for the area/line (default: theme primary)
 * @param {string} props.gradientId - Unique ID for the gradient definition
 * @param {number} [props.height] - Chart height
 * @param {Function} [props.tooltipFormatter] - Optional formatter for tooltip values
 */
const BaseAreaChart = ({
    data,
    dataKey,
    xAxisKey = 'date',
    color = '#3b82f6',
    gradientId = 'colorGradient',
    height,
    tooltipFormatter
}) => {
    return (
        <BaseChart height={height}>
            <AreaChart data={data} margin={{ left: -20, right: 10 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis dataKey={xAxisKey} {...chartTheme.axis} />
                <YAxis {...chartTheme.axis} />
                <Tooltip
                    content={<CustomTooltip formatter={tooltipFormatter} />}
                />
                <Area
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    fillOpacity={1}
                    fill={`url(#${gradientId})`}
                />
            </AreaChart>
        </BaseChart>
    )
}

export default BaseAreaChart
