import React from 'react'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import BaseChart from './BaseChart'
import { chartTheme, CustomTooltip, DonutCenterText, renderDonutLabel, COLORS } from '../../Reports/ChartConfig'

/**
 * Standardized Donut/Pie Chart with optional center text.
 * 
 * @param {Object} props
 * @param {Array} props.data - Data array
 * @param {string} [props.dataKey='value'] - Key for values
 * @param {string} [props.nameKey='name'] - Key for labels
 * @param {string} [props.centerLabel] - Label text for the donut center
 * @param {string|number} [props.centerValue] - Value text for the donut center
 * @param {number} [props.height] - Chart height
 * @param {Array} [props.colors] - Optional color array override
 * @param {Function} [props.tooltipFormatter] - Optional tooltip formatter
 */
const BaseDonutChart = ({
    data,
    dataKey = 'value',
    nameKey = 'name',
    centerLabel,
    centerValue,
    height,
    colors = COLORS,
    tooltipFormatter
}) => {
    return (
        <BaseChart height={height}>
            <PieChart>
                <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />

                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    dataKey={dataKey}
                    nameKey={nameKey}
                    label={renderDonutLabel}
                    labelLine={false}
                    {...chartTheme.donut}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>

                {centerLabel && (
                    <DonutCenterText
                        cx="50%"
                        cy="50%"
                        label={centerLabel}
                        value={centerValue}
                    />
                )}
            </PieChart>
        </BaseChart>
    )
}

export default BaseDonutChart
