'use client';
import { useDraggable } from '@dnd-kit/core';
import { Milestone } from '../../utils/simulationEngine';
import { motion, AnimatePresence } from 'framer-motion';

interface MilestoneNodeProps {
  milestone: Milestone;
  xPos: number;
  yPos: number;
  isVisible: boolean;
  isOverlay?: boolean;
}

export function MilestoneNode({ milestone, xPos, yPos, isVisible, isOverlay }: MilestoneNodeProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: milestone.id,
    disabled: isOverlay,
  });

  // Hide original node when dragging (since overlay is shown)
  if (!isVisible && !isDragging && !isOverlay) return null;
  if (isDragging && !isOverlay) return <div ref={setNodeRef} className="absolute opacity-0" style={{ left: xPos, top: yPos - 80 }} />;

  const dragStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={isOverlay ? undefined : dragStyle}
      className={`absolute flex flex-col items-center pointer-events-auto ${isOverlay ? 'cursor-grabbing z-[100]' : 'cursor-grab z-50'}`}
      initial={false}
      animate={isOverlay ? {} : { x: xPos, y: yPos - 80 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      {...listeners}
      {...attributes}
    >
      <motion.div
        whileHover={isOverlay ? {} : { scale: 1.05, y: -2 }}
        whileTap={isOverlay ? {} : { scale: 1.1, cursor: 'grabbing' }}
        animate={isOverlay ? { scale: 1.1, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" } : { scale: 1 }}
        className={`p-3 bg-slate-800/90 backdrop-blur-md border ${isOverlay ? 'border-violet-400 ring-2 ring-violet-500/20 shadow-2xl' : 'border-slate-600 shadow-xl'} rounded-xl text-xs text-slate-50 transition-all duration-200 w-36 text-center group`}
      >
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-violet-600 text-[10px] font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          {milestone.category}
        </div>
        
        <strong className="block font-semibold truncate text-slate-100">{milestone.label}</strong>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-slate-400 font-medium">Age {milestone.age}</span>
          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
          <span className="text-violet-300 font-bold">${(milestone.cost / 1000).toFixed(0)}k</span>
        </div>
      </motion.div>

      {/* Anchor Line & Dot */}
      <div className={`w-0.5 h-10 bg-gradient-to-b from-slate-600 to-transparent mt-1 shadow-sm transition-opacity ${isOverlay ? 'opacity-50' : 'opacity-100'}`}></div>
      <div className={`w-4 h-4 border-2 border-slate-900 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)] -mt-2 z-10 relative transition-transform ${isOverlay ? 'scale-125' : 'scale-100'}`}></div>
      
      {/* Glow effect */}
      {isOverlay && (
        <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full -z-10 w-32 h-32 -translate-y-1/2"></div>
      )}
    </motion.div>
  );
}
