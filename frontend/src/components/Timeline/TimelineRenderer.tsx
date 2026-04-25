'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { MilestoneNode } from './MilestoneNode';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { ChevronRight, PlusCircle, Maximize2, Zap, Home, Landmark, CreditCard, TrendingUp, Briefcase, Wallet } from 'lucide-react';

export function TimelineRenderer() {
  const { results, milestones, updateMilestone, addMilestone } = useSimulationStore();
  const [domain, setDomain] = useState<[number, number]>([20, 80]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const height = 500; 

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
      .range([80, width - 80]);
  }, [domain, width]);

  const yScale = useMemo(() => {
    const maxNW = d3.max(results, d => d.netWorth) || 10000;
    const minNW = Math.min(0, d3.min(results, d => d.netWorth) || 0);
    return d3.scaleLinear()
      .domain([minNW * 1.1, maxNW * 1.05])
      .range([height - 80, 60]);
  }, [results, height]);

  const lineGenerator = useMemo(() => {
    return d3.line<any>()
      .x(d => xScale(d.age))
      .y(d => yScale(d.netWorth))
      .curve(d3.curveMonotoneX);
  }, [xScale, yScale]);

  const areaGenerator = useMemo(() => {
    return d3.area<any>()
      .x(d => xScale(d.age))
      .y0(yScale(0))
      .y1(d => yScale(d.netWorth))
      .curve(d3.curveMonotoneX);
  }, [xScale, yScale]);

  const pathData = lineGenerator(results) || '';
  const areaData = areaGenerator(results) || '';
  const zeroY = yScale(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 } // Instant responsiveness
    })
  );

  const customSnapModifier = useMemo(() => {
    return ({ transform, active }: any) => {
      if (!active) return transform;
      const m = milestones.find(mil => mil.id === active.id);
      if (!m) return transform;

      const currentX = xScale(m.age) + transform.x;
      const currentAge = xScale.invert(currentX);
      
      // High-precision interpolation for smooth path tracking
      const ageFloor = Math.floor(currentAge);
      const ageCeil = Math.ceil(currentAge);
      const r1 = results.find(r => r.age === ageFloor);
      const r2 = results.find(r => r.age === ageCeil);
      
      let nwAtAge = 0;
      if (r1 && r2 && ageFloor !== ageCeil) {
        const t = (currentAge - ageFloor) / (ageCeil - ageFloor);
        nwAtAge = r1.netWorth + t * (r2.netWorth - r1.netWorth);
      } else {
        nwAtAge = r1?.netWorth || r2?.netWorth || 0;
      }

      const targetY = yScale(nwAtAge);
      const originalY = yScale(results.find(r => r.age === m.age)?.netWorth || 0);

      return {
        ...transform,
        y: targetY - originalY
      };
    };
  }, [xScale, yScale, milestones, results]);

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

  const handleAddMilestone = (category: string) => {
    const newMilestone = {
      id: Math.random().toString(36).substr(2, 9),
      label: `New ${category}`,
      age: 30,
      cost: 500000,
      category: category
    };
    addMilestone(newMilestone);
    setIsAddOpen(false);
  };

  const categories = [
    { label: 'Savings', color: 'bg-emerald-500' },
    { label: 'House Payment', color: 'bg-amber-500' },
    { label: 'Loan Payment', color: 'bg-rose-500' },
    { label: 'EMI', color: 'bg-blue-500' },
    { label: 'SIP', color: 'bg-indigo-500' },
    { label: 'Mutual Fund', color: 'bg-violet-500' },
  ];

  const ticks = xScale.ticks(domain[1] - domain[0] > 30 ? 10 : (domain[1] - domain[0]));

  const activeMilestone = useMemo(() => 
    milestones.find(m => m.id === activeId),
    [milestones, activeId]
  );

  return (
    <div className="relative w-full h-full flex flex-col bg-white/40 backdrop-blur-md rounded-[40px] border border-white/50 p-10 shadow-2xl" ref={containerRef}>
      <header className="z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
          <div className="flex gap-3 items-center bg-white/60 backdrop-blur-sm border border-white/80 px-5 py-2.5 rounded-full shadow-lg shadow-black/5">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`w-3 h-3 rounded-full ${hasShortfall ? 'bg-amber-500 shadow-glow' : 'bg-emerald-500 shadow-glow'}`} 
            />
            <span className={`text-sm font-black uppercase tracking-widest ${hasShortfall ? 'text-amber-700' : 'text-emerald-700'}`}>
              {hasShortfall ? 'Stability Alert' : 'Plan Secure'}
            </span>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsAddOpen(!isAddOpen)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-7 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 transition-all active:scale-95 group"
            >
              <PlusCircle className="w-4 h-4 text-indigo-400 group-hover:rotate-90 transition-transform" />
              Add Event
            </button>

            <AnimatePresence>
              {isAddOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute left-0 mt-4 w-[380px] bg-slate-900 rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.4)] p-6 z-50 border border-white/10 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                  
                  <div className="relative z-10">
                    <div className="px-3 py-2 mb-4">
                      <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Strategy Portfolio</h4>
                      <p className="text-sm font-black text-white mt-1">Select an event to simulate</p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { label: 'Savings', desc: 'Add a lump sum cash injection', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { label: 'House Payment', desc: 'Real estate purchase milestone', icon: Home, color: 'text-amber-500', bg: 'bg-amber-50' },
                        { label: 'Loan Payment', desc: 'Personal or educational loan', icon: Landmark, color: 'text-rose-500', bg: 'bg-rose-50' },
                        { label: 'EMI', desc: 'New monthly liability starts', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'SIP', desc: 'Systematic investment boost', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                        { label: 'Mutual Fund', desc: 'Lump sum market investment', icon: Briefcase, color: 'text-violet-500', bg: 'bg-violet-50' },
                      ].map((cat) => (
                        <button
                          key={cat.label}
                          onClick={() => handleAddMilestone(cat.label)}
                          className="flex items-center gap-4 w-full p-4 rounded-[24px] hover:bg-white/5 transition-all group relative border border-transparent hover:border-white/10"
                        >
                          <div className={`w-12 h-12 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                            <cat.icon className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-black text-white group-hover:text-primary transition-colors">{cat.label}</span>
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-tight">{cat.desc}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-slate-100/50 p-1.5 flex gap-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
          {[
            { label: 'Overview', domain: [20, 80] },
            { label: 'Midlife', domain: [30, 50] },
            { label: 'Retirement', domain: [50, 80] },
          ].map((btn) => (
            <button 
              key={btn.label}
              onClick={() => setDomain(btn.domain as [number, number])} 
              className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all duration-300 ${
                domain[0] === btn.domain[0] && domain[1] === btn.domain[1] 
                ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-600/10' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </header>

      <div className="relative h-[500px] mt-10">
        <svg width={width} height={height} className="overflow-visible absolute inset-0">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
               <stop offset="0%" stopColor="#6366F1" />
               <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="#6366F1" stopOpacity="0.15" />
               <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Ticks */}
          {ticks.map(tick => (
            <g key={tick} className="transition-all duration-500" style={{ transform: `translateX(${xScale(tick)}px)` }}>
              <line x1={0} y1={60} x2={0} y2={height - 80} stroke="#E2E8F0" strokeWidth={1.5} strokeDasharray="6 6" className="opacity-60" />
              <text x={0} y={height - 45} textAnchor="middle" fill="#475569" fontSize="11px" fontWeight="900" className="tracking-tighter">AGE {tick}</text>
            </g>
          ))}

          {/* Zero Line */}
          <motion.line 
            animate={{ y1: zeroY, y2: zeroY }} 
            initial={false}
            x1={80} x2={width - 80} stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="8 8"
          />
          
          {/* Area Fill */}
          <motion.path
            initial={false}
            animate={{ d: areaData }}
            transition={{ type: 'spring', bounce: 0, duration: 1 }}
            fill="url(#areaGrad)"
          />

          {/* Projection Line */}
          <motion.path
            initial={false}
            animate={{ d: pathData }}
            transition={{ type: 'spring', bounce: 0, duration: 1 }}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth={5}
            strokeLinecap="round"
            filter="url(#glow)"
          />
        </svg>

        <DndContext 
          id="timeline-dnd-context"
          sensors={sensors} 
          onDragStart={handleDragStart} 
          onDragEnd={handleDragEnd}
          modifiers={[customSnapModifier]}
        >
          {/* Milestone Layer - Fixed positioning to align with axis */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {milestones.map(m => {
              const xPos = xScale(m.age);
              // Find the net worth at this specific age from results
              const resultAtAge = results.find(r => r.age === m.age);
              const nwAtAge = resultAtAge ? resultAtAge.netWorth : 0;
              const yPos = yScale(nwAtAge);
              
              const isVisible = m.age >= domain[0] && m.age <= domain[1];
              return (
                <MilestoneNode 
                  key={m.id} 
                  milestone={m} 
                  xPos={xPos} 
                  yPos={yPos} 
                  isVisible={isVisible} 
                />
              );
            })}
          </div>

          <DragOverlay dropAnimation={null}>
            {activeMilestone ? (
              <MilestoneNode 
                milestone={activeMilestone} 
                xPos={0} 
                yPos={0} 
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
