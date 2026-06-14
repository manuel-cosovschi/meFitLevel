"use client";

import { useStore } from "@/lib/store";
import { computeMissions } from "@/lib/rpg";
import { rankFromLevel, levelFromXp, RANK_THRESHOLDS } from "@/lib/data/rpg";
import type { Mission } from "@/lib/types";
import { Card, PageHeader, ProgressBar, Pill, RankBadge } from "@/components/ui";
import XPBar from "@/components/XPBar";
import StatGrid from "@/components/StatCard";
import AchievementBadge from "@/components/AchievementBadge";

function MissionRow({ m }: { m: Mission }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
        m.done ? "border-green-500/40 bg-green-500/[0.07]" : "border-line bg-bg-elev/50"
      }`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-md text-xs ${
          m.done ? "bg-green-500/20 text-green-300" : "border border-slate-600 text-transparent"
        }`}
      >
        ✓
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">{m.name}</p>
        <p className="text-[11px] text-slate-400">{m.description}</p>
        {m.goal != null && (
          <div className="mt-1">
            <ProgressBar value={m.progress ?? 0} max={m.goal} color={m.done ? "green" : "blue"} />
          </div>
        )}
      </div>
      <span className="text-xs font-bold text-hunter-cyan">+{m.xp}</span>
    </div>
  );
}

export default function RPGPage() {
  const state = useStore();
  const rpg = state.rpg;
  const setActiveTitle = useStore((s) => s.setActiveTitle);
  const missions = computeMissions(state);
  const info = levelFromXp(rpg.xp);
  const rank = rankFromLevel(info.level);
  const nextRank = RANK_THRESHOLDS.find((t) => t.minLevel > info.level);

  const unlockedTitles = rpg.titles.filter((t) => t.unlocked);
  const unlockedAch = rpg.achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-4">
      <PageHeader title="Sistema" subtitle="Cazador · progresión RPG" />

      {/* Avatar / stats principales */}
      <Card glow>
        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-hunter-blue/50 bg-bg-elev shadow-glow animate-pulse-glow">
            <span className="text-4xl">🗡️</span>
          </div>
          <div className="flex-1">
            <RankBadge rank={rank.rank} label={rank.label} />
            <p className="mt-1 text-sm font-semibold text-white">{state.profile.name}</p>
            {rpg.activeTitle && (
              <p className="text-xs text-violet-300">
                ✦ {rpg.titles.find((t) => t.id === rpg.activeTitle)?.name}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <XPBar xp={rpg.xp} compact />
        </div>
        {nextRank && (
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Próximo rango {nextRank.rank} en nivel {nextRank.minLevel}
          </p>
        )}
      </Card>

      {/* Streaks */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="text-center">
          <p className="text-xl font-black text-white">🔥 {rpg.streaks.workout}</p>
          <p className="text-[10px] uppercase text-slate-400">Entreno</p>
        </Card>
        <Card className="text-center">
          <p className="text-xl font-black text-white">🥩 {rpg.streaks.protein}</p>
          <p className="text-[10px] uppercase text-slate-400">Proteína</p>
        </Card>
        <Card className="text-center">
          <p className="text-xl font-black text-white">🧘 {rpg.streaks.mobility}</p>
          <p className="text-[10px] uppercase text-slate-400">Movilidad</p>
        </Card>
      </div>

      {/* Boss */}
      <Card glow>
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm font-bold text-white">👹 {missions.boss.name}</p>
          <Pill tone={missions.boss.done ? "green" : "violet"}>+{missions.boss.xp} XP</Pill>
        </div>
        <p className="text-xs text-slate-400">{missions.boss.description}</p>
        <div className="mt-2">
          <ProgressBar value={missions.boss.progress ?? 0} max={missions.boss.goal ?? 1} color="violet" />
        </div>
      </Card>

      {/* Misiones diarias */}
      <Card>
        <p className="mb-2 text-sm font-bold text-white">Misiones diarias</p>
        <div className="space-y-2">
          {missions.daily.map((m) => (
            <MissionRow key={m.id} m={m} />
          ))}
        </div>
      </Card>

      {/* Misiones semanales */}
      <Card>
        <p className="mb-2 text-sm font-bold text-white">Misiones semanales</p>
        <div className="space-y-2">
          {missions.weekly.map((m) => (
            <MissionRow key={m.id} m={m} />
          ))}
        </div>
      </Card>

      {/* Stats RPG */}
      <Card>
        <p className="mb-3 text-sm font-bold text-white">Atributos</p>
        <StatGrid stats={rpg.stats} />
      </Card>

      {/* Títulos */}
      <Card>
        <p className="mb-2 text-sm font-bold text-white">
          Títulos ({unlockedTitles.length}/{rpg.titles.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {rpg.titles.map((t) => (
            <button
              key={t.id}
              disabled={!t.unlocked}
              onClick={() => setActiveTitle(rpg.activeTitle === t.id ? undefined : t.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                !t.unlocked
                  ? "border-line bg-bg-elev text-slate-600"
                  : rpg.activeTitle === t.id
                  ? "border-hunter-violet bg-hunter-violet/20 text-violet-200 shadow-glow-violet"
                  : "border-hunter-violet/40 bg-hunter-violet/10 text-violet-300"
              }`}
            >
              {t.unlocked ? "✦" : "🔒"} {t.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Logros */}
      <Card>
        <p className="mb-3 text-sm font-bold text-white">
          Logros ({unlockedAch}/{rpg.achievements.length})
        </p>
        <div className="grid grid-cols-3 gap-2">
          {rpg.achievements.map((a) => (
            <AchievementBadge key={a.id} a={a} />
          ))}
        </div>
      </Card>
    </div>
  );
}
