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
  
  // The ghost placeholder for the original position
  if (isDragging && !isOverlay) {
    return <div ref={setNodeRef} className="absolute opacity-0" style={{ left: xPos, top: yPos }} />;
  }

  const dragStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={isOverlay ? undefined : { ...dragStyle, position: 'absolute', left: xPos, top: yPos }}
      className={`flex flex-col items-center pointer-events-auto ${isOverlay ? 'cursor-grabbing z-[100]' : 'cursor-grab z-50'}`}
      {...listeners}
      {...attributes}
    >
      <div className="flex flex-col items-center -translate-y-full">
        <div
          className={`p-3 bg-white border ${isOverlay ? 'border-indigo-500 shadow-2xl scale-105' : 'border-gray-200 shadow-lg shadow-gray-200/50'} rounded-2xl text-xs transition-all duration-75 w-40 text-center group`}
        >
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-indigo-600 text-[10px] text-white font-bold rounded-full shadow-lg shadow-indigo-600/20 opacity-0 group-hover:opacity-100 transition-all">
            {milestone.category}
          </div>
          
          <strong className="block font-bold truncate text-gray-900 text-sm tracking-tight">{milestone.label}</strong>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Age</span>
              <span className="text-gray-900 font-extrabold">{milestone.age}</span>
            </div>
            <div className="w-[1px] h-4 bg-gray-100 mx-1"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cost</span>
              <span className="text-indigo-600 font-extrabold">₹{(milestone.cost / 1000).toFixed(0)}k</span>
            </div>
          </div>
        </div>

        {/* Anchor Line & Dot */}
        <div className={`w-1 h-10 bg-gray-200 mt-1 transition-opacity ${isOverlay ? 'opacity-50' : 'opacity-100'}`}></div>
        <div className={`w-4 h-4 border-2 border-white rounded-full bg-indigo-600 shadow-lg shadow-indigo-600/50 -mt-2 z-10 relative transition-transform ${isOverlay ? 'scale-110' : 'scale-100'}`}></div>
      </div>
    </div>
  );
}
