'use client';
import { useMemo, useState, useRef, useEffect } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { MilestoneNode } from './MilestoneNode';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';


export function TimelineRenderer() {
  const { results, milestones, updateMilestone } = useSimulationStore();
  const [domain, setDomain] = useState<[number, number]>([20, 80]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [activeId, setActiveId] = useState<string | null>(null);
  const height = 400; 

  const [hasShortfall, setHasShortfall] = useState(false);

  useEffect(() => {
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
        distance: 5 
      }
    })
  );

  const customSnapModifier = useMemo(() => {
    const yearWidth = xScale(21) - xScale(20);
    return ({ transform }: any) => ({
      ...transform,
      x: Math.round(transform.x / yearWidth) * yearWidth,
    });
  }, [xScale]);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, delta } = event;
    setActiveId(null);
    if (!active || !delta) return;
    
    const m = milestones.find(m => m.id === active.id);
    if (!m) return;

    const originalX = xScale(m.age);
    const newX = originalX + delta.x;
    
    let newAge = Math.round(xScale.invert(newX));
    newAge = Math.max(20, Math.min(newAge, 80)); 

    updateMilestone(active.id as string, { age: newAge });
  };

  const ticks = xScale.ticks(domain[1] - domain[0] > 30 ? 10 : (domain[1] - domain[0]));

  const activeMilestone = useMemo(() => 
    milestones.find(m => m.id === activeId),
    [milestones, activeId]
  );

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-white rounded-2xl border border-gray-200 p-4 shadow-sm" ref={containerRef}>
      <header className="z-10 flex justify-between items-center mb-4">
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
            <div className={`w-3 h-3 rounded-full ${hasShortfall ? 'bg-amber-500' : 'bg-green-500'}`}></div>
            <span className={`text-sm font-semibold ${hasShortfall ? 'text-amber-600' : 'text-green-600'}`}>
              {hasShortfall ? 'Shortfall Risk' : 'Safely Funded'}
            </span>
          </div>
          

        </div>

        <div className="bg-gray-50 p-1 flex gap-1 rounded-lg border border-gray-200">
          <button onClick={() => setDomain([20, 80])} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${domain[1]-domain[0]>50 ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>Full View</button>
          <button onClick={() => setDomain([30, 50])} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${domain[0]===30 && domain[1]===50 ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>30 to 50</button>
          <button onClick={() => setDomain([50, 80])} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${domain[0]===50 && domain[1]===80 ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>Retirement</button>
        </div>
      </header>

      <div className="relative flex-1 min-h-[400px]">
        <svg width={width} height={height} className="overflow-visible absolute inset-0">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
               <stop offset="0%" stopColor="#6366F1" />
               <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {ticks.map(tick => (
            <g key={tick} className="text-gray-200 transition-all duration-300" style={{ transform: `translateX(${xScale(tick)}px)` }}>
              <line x1={0} y1={40} x2={0} y2={height - 60} stroke="currentColor" strokeWidth={1} strokeDasharray="4 4" />
              <text x={0} y={height - 35} textAnchor="middle" fill="#94a3b8" fontSize="11px" fontWeight="700">Age {tick}</text>
            </g>
          ))}

          <motion.line 
            animate={{ y1: zeroY, y2: zeroY }} 
            initial={false}
            x1={60} x2={width - 60} stroke="#E2E8F0" strokeWidth={2} strokeDasharray="5 5"
          />
          
          <motion.path
            initial={false}
            animate={{ d: pathData }}
            transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth={4}
            strokeLinecap="round"
            filter="url(#glow)"
          />
        </svg>

        <DndContext 
          id="timeline-dnd-context"
          sensors={sensors} 
          onDragStart={handleDragStart} 
          onDragEnd={handleDragEnd}
          modifiers={[restrictToHorizontalAxis, customSnapModifier]}
        >
          <div className="absolute inset-0 pointer-events-none">
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

          <DragOverlay dropAnimation={dropAnimation}>
            {activeMilestone ? (
              <MilestoneNode 
                milestone={activeMilestone} 
                xPos={xScale(activeMilestone.age)} 
                yPos={height - 60} 
                isVisible={true}
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
