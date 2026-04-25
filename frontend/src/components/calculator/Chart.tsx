'use client';

import { useMemo } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface ChartProps {
  data: { label: string | number; value: number; secondaryValue?: number }[];
  height?: number;
  color?: string;
  fill?: string;
  secondaryColor?: string;
  secondaryFill?: string;
}

export function Chart({ 
  data, 
  height = 250, 
  color = '#4F46E5', 
  fill = '#EEF2FF',
  secondaryColor = '#10B981',
  secondaryFill = '#D1FAE5'
}: ChartProps) {
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 600;

  const { pathDef, areaDef, secondaryPathDef, secondaryAreaDef, xScale, yScale } = useMemo(() => {
    if (!data.length) return { pathDef: '', areaDef: '', secondaryPathDef: '', secondaryAreaDef: '', xScale: null, yScale: null };

    const x = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.left, width - margin.right]);

    const maxPrimary = d3.max(data, (d) => d.value) || 0;
    const maxSecondary = d3.max(data, (d) => d.secondaryValue || 0) || 0;
    const maxVal = Math.max(maxPrimary, maxSecondary);

    const y = d3
      .scaleLinear()
      .domain([0, maxVal])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const lineGenerator = d3
      .line<{ label: string | number; value: number }>()
      .x((_, i) => x(i))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    const areaGenerator = d3
      .area<{ label: string | number; value: number }>()
      .x((_, i) => x(i))
      .y0(height - margin.bottom)
      .y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    let secPath = '';
    let secArea = '';

    if (data[0]?.secondaryValue !== undefined) {
      const lineGenSec = d3
        .line<any>()
        .x((_, i) => x(i))
        .y((d) => y(d.secondaryValue))
        .curve(d3.curveMonotoneX);
      const areaGenSec = d3
        .area<any>()
        .x((_, i) => x(i))
        .y0(height - margin.bottom)
        .y1((d) => y(d.secondaryValue))
        .curve(d3.curveMonotoneX);
        
      secPath = lineGenSec(data) || '';
      secArea = areaGenSec(data) || '';
    }

    return {
      pathDef: lineGenerator(data) || '',
      areaDef: areaGenerator(data) || '',
      secondaryPathDef: secPath,
      secondaryAreaDef: secArea,
      xScale: x,
      yScale: y,
    };
  }, [data, height]);

  if (!pathDef || !xScale || !yScale) return null;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Grid lines */}
        <g strokeDasharray="4,4" className="text-gray-200" stroke="currentColor">
          {yScale.ticks(4).map((tick, i) => (
            <line
              key={`grid-${i}`}
              x1={margin.left}
              x2={width - margin.right}
              y1={yScale(tick)}
              y2={yScale(tick)}
            />
          ))}
        </g>
        
        {/* Y Axis Labels */}
        <g className="text-[10px] font-bold text-gray-400 fill-current">
          {yScale.ticks(4).map((tick, i) => (
            <text
              key={`y-${i}`}
              x={margin.left - 10}
              y={yScale(tick)}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {tick >= 10000000 
                ? (tick / 10000000).toFixed(1) + 'C' 
                : tick >= 100000 
                ? (tick / 100000).toFixed(1) + 'L' 
                : tick > 0 ? (tick/1000).toFixed(0) + 'k' : 0}
            </text>
          ))}
        </g>

        {/* X Axis Labels */}
        <g className="text-[10px] font-bold text-gray-400 fill-current">
          {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0 || i === data.length - 1).map((d, i) => {
             const idx = data.indexOf(d);
             return (
              <text
                key={`x-${idx}`}
                x={xScale(idx)}
                y={height - margin.bottom + 20}
                textAnchor="middle"
              >
                {d.label}
              </text>
             );
          })}
        </g>

        {/* Secondary Area & Line */}
        {secondaryAreaDef && (
          <>
            <motion.path
              d={secondaryAreaDef}
              fill={secondaryFill}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />
            <motion.path
              d={secondaryPathDef}
              fill="none"
              stroke={secondaryColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </>
        )}

        {/* Primary Area & Line */}
        <motion.path
          d={areaDef}
          fill={fill}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ mixBlendMode: 'multiply' }}
        />
        <motion.path
          d={pathDef}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
