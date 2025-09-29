import React from "react";

interface WorkshopStepProps {
  number: number;
  title: string;
  children: React.ReactNode;
  isCompleted?: boolean;
}

export default function WorkshopStep({ number, title, children, isCompleted = false }: WorkshopStepProps) {
  return (
    <div className="relative mb-12 bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-sm">
      <div className="flex items-start gap-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg flex-shrink-0 ${
          isCompleted ? 'bg-green-500' : 'bg-gradient-to-br from-sky-500 to-blue-600'
        }`}>
          {isCompleted ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            number
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">{title}</h3>
          <div className="prose prose-slate max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}