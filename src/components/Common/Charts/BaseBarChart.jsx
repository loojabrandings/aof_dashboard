import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import BaseChart from './BaseChart'
import { chartTheme, CustomTooltip } from '../../Reports/ChartConfig'

/**
 * Standardized Bar Chart component.
 * 
 * @param {Object} props
 * @param {Array} props.data - Chart data array
 * @param {string|Array} props.barKeys - Key(s) for the bar data. String for single bar, Array of objects { key, color, name, stackId } for multiple.
 * @param {string} props.xAxisKey - Key for the X-axis label (default: 'date') (or Y-axis if layout is vertical)
 * @param {string} props.color - Default hex color for single bar
 * @param {string} props.layout - 'horizontal' or 'vertical'
 * @param {number} [props.height] - Chart height
 * @param {Function} [props.tooltipFormatter] - Optional formatter for tooltip values
 * @param {Function} [props.tickFormatter] - Optional formatter for axis ticks
 */
const BaseBarChart = ({
    data,
    barKeys,
    xAxisKey = 'date',
    color = '#3b82f6',
    layout = 'horizontal',
    height,
    tooltipFormatter,
    tickFormatter,
    barSize
}) => {
    const isVertical = layout === 'vertical'

    // Normalize bar configuration
    const bars = Array.isArray(barKeys)
        ? barKeys
        : [{ key: barKeys, color: color }]

    return (
        <BaseChart height={height}>
            <BarChart
                data={data}
                layout={layout}
                margin={isVertical ? { left: -10, right: 10 } : { left: -20, right: 0 }}
            >
                <CartesianGrid {...chartTheme.grid} />

                {isVertical ? (
                    <>
                        <XAxis type="number" {...chartTheme.axis} tickFormatter={tickFormatter} />
                        <YAxis dataKey={xAxisKey} type="category" width={90} {...chartTheme.axis} />
                    </>
                ) : (
                    <>
                        <XAxis dataKey={xAxisKey} {...chartTheme.axis} />
                        <YAxis {...chartTheme.axis} tickFormatter={tickFormatter} />
                    </>
                )}

                <Tooltip
                    content={<CustomTooltip formatter={tooltipFormatter} />}
                    cursor={chartTheme.tooltipCursor}
                />

                {bars.map((bar, index) => (
                    <Bar
                        key={bar.key}
                        dataKey={bar.key}
                        fill={bar.color || color}
                        name={bar.name}
                        stackId={bar.stackId}
                        radius={isVertical ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                        barSize={barSize || (isVertical ? 18 : 24)}
                    />
                ))}
            </BarChart>
        </BaseChart>
    )
}

export default BaseBarChart
