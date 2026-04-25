'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Trash2, DollarSign, Tag } from 'lucide-react';
import { Milestone } from '@/utils/simulationEngine';
import { useSimulationStore } from '@/store/useSimulationStore';

interface EditMilestoneModalProps {
  milestone: Milestone;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditMilestoneModal({ milestone, isOpen, onClose }: EditMilestoneModalProps) {
  const { updateMilestone, removeMilestone } = useSimulationStore();
  const [label, setLabel] = useState(milestone.label);
  const [cost, setCost] = useState(milestone.cost);

  const handleSave = () => {
    updateMilestone(milestone.id, { label, cost });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 rounded-[40px] shadow-[0_40px_120px_rgba(0,0,0,0.5)] z-[201] p-10 space-y-8 overflow-hidden border border-white/10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <header className="flex justify-between items-start relative z-10">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter">Edit Event</h2>
                <p className="text-xs text-primary font-black uppercase tracking-[0.2em] mt-2">Adjust your strategy</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6 text-white/40" />
              </button>
            </header>

            <div className="space-y-6 relative z-10">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-white/40 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" /> Event Name
                </label>
                <input 
                  type="text" 
                  value={label} 
                  onChange={(e) => setLabel(e.target.value)}
                  className="horizon-input !py-4 bg-slate-800 text-white border-white/10"
                  placeholder="e.g. Dream House"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-white/40 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5" /> Target Amount (₹)
                </label>
                <div className="relative group">
                  <input 
                    type="number" 
                    value={cost} 
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="horizon-input !py-4 !pl-10 bg-slate-800 text-white border-white/10"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black">₹</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 relative z-10">
              <button 
                onClick={() => { removeMilestone(milestone.id); onClose(); }}
                className="w-14 h-14 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl flex items-center justify-center transition-all group shadow-sm"
                title="Delete Event"
              >
                <Trash2 className="w-6 h-6 group-active:scale-90 transition-transform" />
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 horizon-btn-primary h-14 text-sm uppercase tracking-widest"
              >
                Save Changes
                <Check className="w-5 h-5 ml-1" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
