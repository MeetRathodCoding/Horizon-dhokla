'use client';
import { useDraggable } from '@dnd-kit/core';
import { Milestone } from '../../utils/simulationEngine';
import { motion } from 'framer-motion';

interface MilestoneNodeProps {
  milestone: Milestone;
  xPos: number;
  yPos: number;
  isVisible: boolean;
}

export function MilestoneNode({ milestone, xPos, yPos, isVisible }: MilestoneNodeProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: milestone.id,
  });

  if (!isVisible && !isDragging) return null;

  const style = transform ? {
    transform: `translate3d(${transform.x}px, 0, 0)`,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="absolute top-0 flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing z-50"
      animate={{ x: xPos, y: yPos - 80 }}
      transition={isDragging ? { duration: 0 } : { type: 'spring', bounce: 0.2, duration: 0.5 }}
      {...listeners}
      {...attributes}
    >
      <div className={`p-3 bg-slate-800 border ${isDragging ? 'border-violet-500 shadow-2xl shadow-violet-500/20' : 'border-slate-600 shadow-lg'} rounded-lg text-xs text-slate-50 transition w-32 text-center`}>
        <strong className="block font-medium truncate">{milestone.label}</strong>
        <span className="text-slate-400 block mt-0.5">Age {milestone.age}</span>
        <span className="block text-violet-300 font-bold mt-1">${milestone.cost.toLocaleString()}</span>
      </div>
      {/* Anchor Line */}
      <div className="w-px h-8 bg-slate-600 mt-1 shadow-sm"></div>
      <div className="w-3 h-3 border-2 border-slate-900 rounded-full bg-violet-400 -mt-1.5 z-10 relative"></div>
    </motion.div>
  );
}
