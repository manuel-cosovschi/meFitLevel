"use client";

import { levelFromXp, rankFromLevel } from "@/lib/data/rpg";
import { ProgressBar, RankBadge } from "@/components/ui";

export default function XPBar({
  xp,
  compact = false,
}: {
  xp: number;
  compact?: boolean;
}) {
  const info = levelFromXp(xp);
  const rank = rankFromLevel(info.level);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-hunter-blue/50 bg-bg-elev text-sm font-black text-hunter-cyan shadow-glow-soft">
            {info.level}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Nivel</p>
            <p className="text-sm font-semibold text-white">{rank.label}</p>
          </div>
        </div>
        {!compact && <RankBadge rank={rank.rank} />}
      </div>
      <ProgressBar value={info.intoLevel} max={info.intoLevel + info.toNext} color="blue" />
      <div className="flex justify-between text-[11px] text-slate-400">
        <span>{xp.toLocaleString("es-AR")} XP total</span>
        <span>{info.toNext} XP para nivel {info.level + 1}</span>
      </div>
    </div>
  );
}
