'use client';
import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Milestone } from '../../utils/simulationEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '../../store/useSimulationStore';
import EditMilestoneModal from './EditMilestoneModal';

interface MilestoneNodeProps {
  milestone: Milestone;
  xPos: number;
  yPos: number;
  isVisible: boolean;
  isOverlay?: boolean;
  style?: React.CSSProperties;
}

export function MilestoneNode({ milestone, xPos, yPos, isVisible, isOverlay, style }: MilestoneNodeProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: milestone.id,
    disabled: isOverlay,
  });

  if (!isVisible && !isDragging && !isOverlay) return null;
  
  if (isDragging && !isOverlay) {
    return <div ref={setNodeRef} className="absolute opacity-0" style={{ left: xPos, top: yPos }} />;
  }

  const dragStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  // For DragOverlay, we use the style provided by DndContext
  const finalStyle = isOverlay 
    ? { ...style, position: 'fixed' as const } 
    : { ...dragStyle, position: 'absolute' as const, left: xPos, top: yPos };

  return (
    <>
      <div
        ref={setNodeRef}
        style={finalStyle}
        className={`flex flex-col items-center pointer-events-auto ${isOverlay ? 'cursor-grabbing z-[100]' : 'cursor-grab z-50'}`}
        {...listeners}
        {...attributes}
        onClick={(e) => {
          if (!isOverlay) setIsEditOpen(true);
        }}
      >
        {/* Card and Line container */}
        <motion.div 
          className="flex flex-col items-center"
          style={{ transform: 'translateY(-10px)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={isDragging || isOverlay ? { opacity: 1, y: 0, transition: { duration: 0 } } : { opacity: 1, y: 0 }}
        >
          <div
            className={`relative p-5 bg-slate-900/95 backdrop-blur-md border ${
              isOverlay 
                ? 'border-primary shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-110 z-50' 
                : 'border-white/10 shadow-premium hover:border-primary/50'
            } rounded-[24px] transition-all duration-200 w-44 group overflow-hidden -translate-y-full`}
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-primary opacity-80" />
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">Category</span>
                  <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/5 rounded-md w-fit">
                    {milestone.category}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">Age</span>
                  <span className="text-sm font-black text-white leading-none">{milestone.age}</span>
                </div>
              </div>

              <button 
                onPointerDown={(e) => {
                  e.stopPropagation();
                  useSimulationStore.getState().removeMilestone(milestone.id);
                }}
                className="absolute top-2 right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white z-50 pointer-events-auto"
              >
                <span className="text-[10px] font-black">✕</span>
              </button>

              <div className="h-[1px] bg-white/10 w-full" />

              <div>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1">Target Event</span>
                <strong className="block font-black truncate text-white text-[13px] tracking-tight group-hover:text-primary transition-colors">
                  {milestone.label}
                </strong>
              </div>

              <div className="flex items-center gap-2 mt-0.5 bg-white/5 p-2 rounded-xl border border-white/5">
                 <span className="text-xs font-black text-primary">₹{(milestone.cost / 1000).toFixed(0)}k</span>
                 <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">REQUIRED</span>
              </div>
            </div>
          </div>
          
          <div className="w-0.5 h-10 bg-gradient-to-b from-slate-200 via-slate-200/50 to-transparent -translate-y-full" />
        </motion.div>

        {/* Anchor Dot - Centered on (xPos, yPos) */}
        <motion.div 
          animate={isOverlay ? { scale: [1, 1.4, 1], shadow: '0 0 20px rgba(99,102,241,0.6)' } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`w-5 h-5 border-[3px] border-white rounded-full bg-primary shadow-glow z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform ${isOverlay ? 'scale-125' : 'scale-100'}`}
        />
      </div>

      {!isOverlay && (
        <EditMilestoneModal 
          milestone={milestone}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </>
  );
}
