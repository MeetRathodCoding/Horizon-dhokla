interface ResultCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  highlight?: boolean;
}

export function ResultCard({ title, value, subtitle, highlight = false }: ResultCardProps) {
  return (
    <div className={`p-6 rounded-2xl border transition-all ${highlight ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg scale-[1.02]' : 'bg-white border-gray-200 text-gray-900 shadow-sm'} flex flex-col gap-2`}>
      <h4 className={`text-sm font-bold uppercase tracking-wider ${highlight ? 'text-indigo-200' : 'text-gray-500'}`}>{title}</h4>
      <p className="text-3xl font-extrabold tracking-tight">{value}</p>
      {subtitle && <p className={`text-xs font-semibold ${highlight ? 'text-indigo-200' : 'text-gray-400'}`}>{subtitle}</p>}
    </div>
  );
}
