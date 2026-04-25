'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Info } from 'lucide-react';
import Link from 'next/link';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  inputs: React.ReactNode;
  results: React.ReactNode;
  chart?: React.ReactNode;
}

export default function CalculatorLayout({ title, description, inputs, results, chart }: CalculatorLayoutProps) {
  return (
    <div className="min-h-screen pb-20 relative">
      {/* Background blobs for depth */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[5%] right-[10%] w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[5%] left-[5%] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1440px] mx-auto px-8 space-y-12 pt-12">
        <header className="flex flex-col gap-6 -mx-8 px-8 py-12 bg-slate-900 relative overflow-hidden rounded-b-[40px] shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -mr-64 -mt-64" />
          
          <Link href="/" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-all font-black text-xs uppercase tracking-widest group w-fit relative z-10">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all backdrop-blur-md">
              <ChevronLeft className="w-4 h-4" />
            </div>
            Back to Dashboard
          </Link>

          <div className="flex items-end justify-between relative z-10">
            <div>
              <h1 className="text-6xl font-black text-white tracking-tighter leading-none">{title}</h1>
              <p className="text-slate-300 font-bold mt-4 tracking-tight max-w-2xl text-lg opacity-90">{description}</p>
            </div>
            <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl">
               <Info className="w-5 h-5 text-indigo-400" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Real-time Analysis Active</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Inputs Section */}
          <motion.aside 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-4"
          >
            <div className="horizon-card overflow-hidden bg-slate-800 border-white/5 h-full shadow-2xl">
              <div className="bg-slate-900 p-10 relative overflow-hidden border-b border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="relative z-10">
                  <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow"></div>
                    Parameters
                  </h2>
                  <p className="text-[10px] text-white font-black uppercase tracking-[0.2em] mt-2">Adjust Variables</p>
                </div>
              </div>
              <div className="p-10 space-y-10 relative z-10">
                {inputs}
              </div>
            </div>
          </motion.aside>

          {/* Results & Chart Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-8 flex flex-col gap-10"
          >
            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {results}
            </div>

            {/* Chart Area */}
            {chart && (
              <div className="horizon-card p-10 bg-white/40 backdrop-blur-md border border-white/60 flex-1 flex flex-col min-h-[550px]">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Growth Projection</h2>
                  <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-4 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow"></div>
                    Dynamic Forecast
                  </div>
                </div>
                <div className="flex-1 w-full">
                  {chart}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
