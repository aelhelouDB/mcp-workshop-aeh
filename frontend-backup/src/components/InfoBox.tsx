import React from "react";

interface InfoBoxProps {
  type: "info" | "warning" | "tip";
  children: React.ReactNode;
}

const configs = {
  info: {
    border: "border-sky-500/30",
    glow: "from-sky-400/20 to-sky-500/10",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-200",
    textColor: "text-slate-100",
    icon: "ℹ️",
  },
  warning: {
    border: "border-amber-500/40",
    glow: "from-amber-400/25 to-amber-500/10",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-200",
    textColor: "text-slate-100",
    icon: "⚠️",
  },
  tip: {
    border: "border-emerald-500/30",
    glow: "from-emerald-400/25 to-emerald-500/10",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-200",
    textColor: "text-slate-100",
    icon: "💡",
  },
} as const;

export default function InfoBox({ type, children }: InfoBoxProps) {
  const config = configs[type];

  return (
    <div className={`relative my-6 overflow-hidden rounded-2xl border bg-slate-900/40 px-5 py-4 backdrop-blur ${config.border}`}>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${config.glow}`} />
      <div className="relative flex items-start gap-4">
        <div
          className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg ${config.iconBg} ${config.iconColor}`}
        >
          {config.icon}
        </div>
        <div className={`flex-1 text-sm leading-relaxed ${config.textColor}`}>
          {children}
        </div>
      </div>
    </div>
  );
}