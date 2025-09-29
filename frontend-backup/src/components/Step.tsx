import React from "react";

interface StepProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

export default function Step({ number, title, children }: StepProps) {
  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
        <div className="flex flex-shrink-0 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-lg font-semibold text-white shadow-lg shadow-sky-600/30">
            {number}
          </div>
          <h2 className="text-xl font-semibold text-white lg:hidden">{title}</h2>
        </div>

        <div className="flex-1">
          <h2 className="hidden text-2xl font-semibold text-white lg:block">{title}</h2>
          <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate-200">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}