'use client';
import { useMemo, useState, useRef, useEffect } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { MilestoneNode } from './MilestoneNode';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';

export function TimelineRenderer() {
  const { results, milestones, updateMilestone } = useSimulationStore();
  const [domain, setDomain] = useState<[number, number]>([20, 80]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const height = 400; 

  const [hasShortfall, setHasShortfall] = useState(false);

  useEffect(() => {
    // Check if any net worth drops below 0
    const short = results.some(r => r.netWorth < 0);
    setHasShortfall(short);
  }, [results]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    const observer = new ResizeObserver(handleResize);
    if(containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const xScale = useMemo(() => {
    return d3.scaleLinear()
      .domain(domain)
      .range([60, width - 60]);
  }, [domain, width]);

  const yScale = useMemo(() => {
    const maxNW = d3.max(results, d => d.netWorth) || 10000;
    const minNW = Math.min(0, d3.min(results, d => d.netWorth) || 0);
    return d3.scaleLinear()
      .domain([minNW * 1.1, maxNW * 1.05])
      .range([height - 60, 40]);
  }, [results, height]);

  const lineGenerator = useMemo(() => {
    return d3.line<any>()
      .x(d => xScale(d.age))
      .y(d => yScale(d.netWorth))
      .curve(d3.curveMonotoneX);
  }, [xScale, yScale]);

  const pathData = lineGenerator(results) || '';
  const zeroY = yScale(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5 // require moving 5px before drag starts to not block click interactions
      }
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, delta } = event;
    if (!active || !delta) return;
    
    const m = milestones.find(m => m.id === active.id);
    if (!m) return;

    const originalX = xScale(m.age);
    const newX = originalX + delta.x;
    
    let newAge = Math.round(xScale.invert(newX));
    newAge = Math.max(20, Math.min(newAge, 80)); // Clamp between 20-80

    updateMilestone(active.id as string, { age: newAge });
  };

  // Generate Year Ticks
  const ticks = xScale.ticks(domain[1] - domain[0] > 30 ? 10 : (domain[1] - domain[0]));

  return (
    <div className="relative w-full h-full flex flex-col" ref={containerRef}>
      <header className="absolute top-2 left-4 z-10 flex gap-4 items-center">
        <div className="flex gap-2 items-center bg-slate-800/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-full shadow-lg">
          <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] ${hasShortfall ? 'bg-amber-500 text-amber-500' : 'bg-emerald-500 text-emerald-500'}`}></div>
          <span className={`text-sm font-semibold ${hasShortfall ? 'text-amber-400' : 'text-emerald-400'}`}>
            {hasShortfall ? 'Shortfall Risk' : 'Safely Funded'}
          </span>
        </div>
      </header>

      <div className="absolute top-2 right-4 bg-slate-800/80 backdrop-blur p-1 flex gap-1 rounded-lg border border-slate-700 z-10 shadow-lg">
        <button onClick={() => setDomain([20, 80])} className={`px-3 py-1.5 text-xs font-medium rounded ${domain[1]-domain[0]>50 ? 'bg-slate-700 text-slate-50' : 'text-slate-400 hover:text-slate-200'}`}>Full View</button>
        <button onClick={() => setDomain([30, 50])} className={`px-3 py-1.5 text-xs font-medium rounded ${domain[0]===30 && domain[1]===50 ? 'bg-slate-700 text-slate-50' : 'text-slate-400 hover:text-slate-200'}`}>30 to 50</button>
        <button onClick={() => setDomain([50, 80])} className={`px-3 py-1.5 text-xs font-medium rounded ${domain[0]===50 && domain[1]===80 ? 'bg-slate-700 text-slate-50' : 'text-slate-400 hover:text-slate-200'}`}>Retirement</button>
      </div>

      {/* Primary SVG Chart */}
      <svg width={width} height={height} className="overflow-visible mt-10">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
             <stop offset="0%" stopColor="#3B82F6" />
             <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>

        {/* X Axis Ticks */}
        {ticks.map(tick => (
          <g key={tick} className="text-slate-600 transition-all duration-300 transform-gpu" style={{ transform: `translateX(${xScale(tick)}px)` }}>
            <line x1={0} y1={40} x2={0} y2={height - 60} stroke="currentColor" strokeWidth={1} strokeDasharray="2 4" />
            <text x={0} y={height - 45} textAnchor="middle" fill="#94A3B8" fontSize="12px" fontWeight="500">Age {tick}</text>
          </g>
        ))}

        {/* Zero baseline */}
        <motion.line 
          animate={{ y1: zeroY, y2: zeroY }} 
          initial={false}
          x1={60} x2={width - 60} stroke="#334155" strokeWidth={2} 
        />
        
        {/* Main Projection Curve */}
        <motion.path
          initial={false}
          animate={{ d: pathData }}
          transition={{ type: 'spring', bounce: 0.1, duration: 0.6 }}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Shortfall Projection coloring (values below zero line) can be achieved by masking, but for MVP standard line represents it */}
      </svg>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="absolute top-10 left-0 w-full pointer-events-none" style={{ height: height }}>
          {milestones.map(m => {
            const xPos = xScale(m.age);
            const isVisible = m.age >= domain[0] && m.age <= domain[1];
            return (
              <MilestoneNode 
                key={m.id} 
                milestone={m} 
                xPos={xPos} 
                yPos={height - 60} 
                isVisible={isVisible} 
              />
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}
