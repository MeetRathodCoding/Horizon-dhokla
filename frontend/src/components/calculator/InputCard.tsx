import { ReactNode } from 'react';

interface InputCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function InputCard({ title, children, icon }: InputCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        {icon && <div className="text-indigo-600 bg-indigo-50 p-2 rounded-lg">{icon}</div>}
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
