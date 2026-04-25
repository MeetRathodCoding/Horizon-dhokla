'use client';

import { useMemo, useState, useRef } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';

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
  height = 280, 
  color = '#6366F1', // Primary Indigo
  secondaryColor = '#10B981', // Emerald
}: ChartProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const [hoverData, setHoverData] = useState<{ x: number; y: number; val: number; label: string | number } | null>(null);
  
  const margin = { top: 40, right: 30, bottom: 40, left: 60 };
  const width = 800;

  const { pathDef, areaDef, secondaryPathDef, secondaryAreaDef, xScale, yScale } = useMemo(() => {
    if (!data.length) return { pathDef: '', areaDef: '', secondaryPathDef: '', secondaryAreaDef: '', xScale: null, yScale: null };

    const x = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.left, width - margin.right]);

    const maxPrimary = d3.max(data, (d) => d.value) || 0;
    const maxSecondary = d3.max(data, (d) => d.secondaryValue || 0) || 0;
    const maxVal = Math.max(maxPrimary, maxSecondary) * 1.1;

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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !xScale || !yScale) return;
    const svg = containerRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const localPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    const xVal = xScale.invert(localPoint.x);
    const index = Math.round(xVal);
    
    if (index >= 0 && index < data.length) {
      const d = data[index];
      setHoverData({
        x: xScale(index),
        y: yScale(d.value),
        val: d.value,
        label: d.label
      });
    }
  };

  if (!pathDef || !xScale || !yScale) return null;

  return (
    <div className="w-full relative group">
      <svg 
        ref={containerRef}
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-auto overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverData(null)}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="secAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="0" />
          </linearGradient>
          <filter id="glowChart" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid lines */}
        <g className="opacity-10">
          {yScale.ticks(5).map((tick, i) => (
            <line
              key={`grid-${i}`}
              x1={margin.left}
              x2={width - margin.right}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="white"
              strokeWidth={1}
            />
          ))}
        </g>
        
        {/* Y Axis Labels */}
        <g className="text-[10px] font-black fill-white/30 uppercase tracking-widest">
          {yScale.ticks(5).map((tick, i) => (
            <text
              key={`y-${i}`}
              x={margin.left - 15}
              y={yScale(tick)}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {tick >= 10000000 
                ? (tick / 10000000).toFixed(1) + 'Cr' 
                : tick >= 100000 
                ? (tick / 100000).toFixed(1) + 'L' 
                : tick > 0 ? (tick/1000).toFixed(0) + 'k' : 0}
            </text>
          ))}
        </g>

        {/* X Axis Labels */}
        <g className="text-[10px] font-black fill-white/30 uppercase tracking-widest">
          {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1).map((d, i) => {
             const idx = data.indexOf(d);
             return (
              <text
                key={`x-${idx}`}
                x={xScale(idx)}
                y={height - margin.bottom + 25}
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
              fill="url(#secAreaGradient)"
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
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="opacity-50"
            />
          </>
        )}

        {/* Primary Area & Line */}
        <motion.path
          d={areaDef}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.path
          d={pathDef}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          filter="url(#glowChart)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Hover Interaction */}
        <AnimatePresence>
          {hoverData && (
            <g>
              <motion.line
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                x1={hoverData.x}
                x2={hoverData.x}
                y1={margin.top}
                y2={height - margin.bottom}
                stroke="white"
                strokeWidth={1}
                strokeDasharray="4 4"
                className="opacity-30"
              />
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                cx={hoverData.x}
                cy={hoverData.y}
                r={6}
                fill={color}
                stroke="white"
                strokeWidth={3}
                className="shadow-glow"
              />
              
              <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <rect
                  x={hoverData.x - 60}
                  y={hoverData.y - 45}
                  width={120}
                  height={35}
                  rx={8}
                  fill="#0F172A"
                  className="shadow-2xl"
                />
                <text
                  x={hoverData.x}
                  y={hoverData.y - 23}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12px"
                  fontWeight="900"
                >
                  ₹{hoverData.val.toLocaleString('en-IN')}
                </text>
              </motion.g>
            </g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
