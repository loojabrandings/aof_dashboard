import React from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import BaseChart from './BaseChart'
import { chartTheme, CustomTooltip } from '../../Reports/ChartConfig'

/**
 * Standardized Composed Chart (Bars + Lines).
 * 
 * @param {Object} props
 * @param {Array} props.data - Data array
 * @param {Array} props.bars - Array of bar configs { key, coloy, name, stackId }
 * @param {Array} props.lines - Array of line configs { key, color, name }
 * @param {string} props.xAxisKey - Key for X axis
 * @param {number} [props.height] - Chart height
 * @param {Function} [props.tooltipFormatter] - optional formatter
 */
const BaseComposedChart = ({
    data,
    bars = [],
    lines = [],
    xAxisKey = 'date',
    height,
    tooltipFormatter,
    tickFormatter
}) => {
    return (
        <BaseChart height={height}>
            <ComposedChart data={data} margin={{ left: -20, right: 10 }}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis dataKey={xAxisKey} {...chartTheme.axis} />
                <YAxis {...chartTheme.axis} tickFormatter={tickFormatter} />
                <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
                <Legend wrapperStyle={chartTheme.legend.wrapperStyle} />

                {bars.map((bar) => (
                    <Bar
                        key={bar.key}
                        dataKey={bar.key}
                        stackId={bar.stackId}
                        fill={bar.color}
                        name={bar.name}
                        radius={[2, 2, 0, 0]}
                        barSize={16}
                    />
                ))}

                {lines.map((line) => (
                    <Line
                        key={line.key}
                        type="monotone"
                        dataKey={line.key}
                        stroke={line.color}
                        strokeWidth={2}
                        dot={{ r: 3, fill: line.color }}
                        name={line.name}
                    />
                ))}
            </ComposedChart>
        </BaseChart>
    )
}

export default BaseComposedChart
