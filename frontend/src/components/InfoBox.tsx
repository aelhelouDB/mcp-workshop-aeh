import React from "react";

interface InfoBoxProps {
  type: "info" | "warning" | "tip" | "success";
  children: React.ReactNode;
  title?: string;
}

const configs = {
  info: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    textColor: "text-slate-800",
    titleColor: "text-blue-900",
    icon: "ℹ️",
  },
  warning: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    textColor: "text-slate-800",
    titleColor: "text-amber-900",
    icon: "⚠️",
  },
  tip: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    textColor: "text-slate-800",
    titleColor: "text-emerald-900",
    icon: "💡",
  },
  success: {
    border: "border-green-200",
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    textColor: "text-slate-800",
    titleColor: "text-green-900",
    icon: "✅",
  },
} as const;

export default function InfoBox({ type, children, title }: InfoBoxProps) {
  const config = configs[type];

  return (
    <div className={`my-6 rounded-xl border-2 ${config.border} ${config.bg} p-6`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg flex-shrink-0 ${config.iconBg} ${config.iconColor}`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-bold mb-3 text-lg ${config.titleColor}`}>{title}</h4>
          )}
          <div className={`leading-relaxed ${config.textColor}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}