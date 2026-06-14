"use client";

import { rankFromLevel } from "@/lib/data/rpg";

export default function LevelUpModal({
  level,
  newTitles,
  onClose,
}: {
  level: number;
  newTitles: string[];
  onClose: () => void;
}) {
  const rank = rankFromLevel(level);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-level-pop w-full max-w-sm rounded-3xl border border-hunter-blue/50 bg-bg-soft p-6 text-center shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-hunter-cyan">¡Subiste de nivel!</p>
        <div className="my-4 flex items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-hunter-blue/60 bg-bg-elev text-5xl font-black text-gradient shadow-glow animate-pulse-glow">
            {level}
          </div>
        </div>
        <p className="text-lg font-bold text-white">Nivel {level}</p>
        <p className="text-sm text-slate-300">{rank.label}</p>

        {newTitles.length > 0 && (
          <div className="mt-4 space-y-1">
            <p className="text-[11px] uppercase tracking-widest text-slate-400">Título desbloqueado</p>
            {newTitles.map((t) => (
              <p key={t} className="font-semibold text-violet-300">
                ✦ {t}
              </p>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-hunter-blue to-hunter-violet py-3 font-semibold text-white shadow-glow active:scale-[0.98]"
        >
          Seguir cazando
        </button>
      </div>
    </div>
  );
}
