'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  label: string;
  value: number;
}

interface SimpleChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
}

export default function SimpleChart({ data, color = '#6366F1', height = 400 }: SimpleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const margin = { top: 40, right: 40, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
      .domain(data.map(d => d.label))
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, (d3.max(data, d => d.value) || 0) * 1.1])
      .nice()
      .range([innerHeight, 0]);

    // Define Gradients
    const defs = svg.append('defs');
    
    const lineGradient = defs.append('linearGradient')
      .attr('id', 'chartLineGradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%');
    lineGradient.append('stop').attr('offset', '0%').attr('stop-color', color);
    lineGradient.append('stop').attr('offset', '100%').attr('stop-color', '#0EA5E9');

    const areaGradient = defs.append('linearGradient')
      .attr('id', 'chartAreaGradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    areaGradient.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.2);
    areaGradient.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.05)
      .call(d3.axisLeft(y)
        .tickSize(-innerWidth)
        .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke-dasharray', '5,5');

    // Area
    const area = d3.area<DataPoint>()
      .x(d => x(d.label) || 0)
      .y0(innerHeight)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#chartAreaGradient)')
      .attr('d', area);

    // Line
    const line = d3.line<DataPoint>()
      .x(d => x(d.label) || 0)
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'url(#chartLineGradient)')
      .attr('stroke-width', 4)
      .attr('stroke-linecap', 'round')
      .style('filter', 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))')
      .attr('d', line);

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickValues(x.domain().filter((_, i) => i % Math.ceil(data.length / 6) === 0)))
      .attr('font-size', '10px')
      .attr('font-weight', '900')
      .attr('color', 'rgba(255, 255, 255, 0.3)') // Pure White Low Opacity
      .attr('class', 'uppercase tracking-widest')
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').remove());

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => {
        const val = Number(d);
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
        if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
        return `₹${val}`;
      }))
      .attr('font-size', '10px')
      .attr('font-weight', '900')
      .attr('color', 'rgba(255, 255, 255, 0.3)') // Pure White Low Opacity
      .attr('class', 'uppercase tracking-widest')
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').remove());

  }, [data, color, height]);

  return (
    <div className="w-full h-full min-h-[400px] relative">
      <svg ref={svgRef} className="w-full h-full overflow-visible" height={height}></svg>
    </div>
  );
}
