"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { Rank } from "@/lib/types";

export function Card({
  children,
  className = "",
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-bg-card/80 p-4 backdrop-blur-sm ${
        glow ? "shadow-glow-soft" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function ProgressBar({
  value,
  max,
  className = "",
  color = "blue",
}: {
  value: number;
  max: number;
  className?: string;
  color?: "blue" | "violet" | "cyan" | "green" | "amber";
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const colors: Record<string, string> = {
    blue: "from-hunter-blue to-hunter-cyan",
    violet: "from-hunter-violet to-hunter-indigo",
    cyan: "from-cyan-400 to-hunter-blue",
    green: "from-green-400 to-emerald-500",
    amber: "from-amber-400 to-orange-500",
  };
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-bg-elev ${className}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r ${colors[color]} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Pill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "blue" | "violet" | "green" | "amber" | "red" | "muted";
}) {
  const tones: Record<string, string> = {
    default: "border-line bg-bg-elev text-slate-300",
    blue: "border-hunter-blue/40 bg-hunter-blue/10 text-hunter-cyan",
    violet: "border-hunter-violet/40 bg-hunter-violet/10 text-violet-300",
    green: "border-green-500/40 bg-green-500/10 text-green-300",
    amber: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    red: "border-red-500/40 bg-red-500/10 text-red-300",
    muted: "border-line bg-transparent text-slate-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

const RANK_COLORS: Record<Rank, string> = {
  E: "text-rank-e border-rank-e/50",
  D: "text-rank-d border-rank-d/50",
  C: "text-rank-c border-rank-c/50",
  B: "text-rank-b border-rank-b/50",
  A: "text-rank-a border-rank-a/50",
  S: "text-rank-s border-rank-s/50",
  National: "text-rank-n border-rank-n/50",
};

export function RankBadge({ rank, label }: { rank: Rank; label?: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border bg-bg-elev px-3 py-1.5 ${RANK_COLORS[rank]}`}
    >
      <span className="text-xl font-black leading-none">{rank === "National" ? "N" : rank}</span>
      {label && <span className="text-xs font-medium text-slate-300">{label}</span>}
    </div>
  );
}

export function LinkCard({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string;
  icon: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-line bg-bg-card/80 p-4 transition active:scale-[0.98]"
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="font-semibold text-white">{title}</p>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      <span className="text-slate-500">›</span>
    </Link>
  );
}

export function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line py-10 text-center">
      <span className="text-3xl opacity-60">{icon}</span>
      <p className="px-6 text-sm text-slate-400">{text}</p>
    </div>
  );
}
