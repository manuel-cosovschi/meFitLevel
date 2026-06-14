"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { getTodaySession, weeklyMuscleStatus, workoutsThisWeek } from "@/lib/selectors";
import { computeMissions } from "@/lib/rpg";
import { todayKey } from "@/lib/utils";
import { Card, ProgressBar, Pill, PageHeader } from "@/components/ui";
import XPBar from "@/components/XPBar";
import WeeklyMuscleMap from "@/components/WeeklyMuscleMap";

export default function DashboardPage() {
  const state = useStore();
  const session = getTodaySession(state);
  const { trained, pending } = weeklyMuscleStatus(state);
  const missions = computeMissions(state);
  const weekCount = workoutsThisWeek(state);

  const today = todayKey();
  const nut = state.nutritionLogs.find((n) => n.date === today);
  const protein = nut?.proteinConsumed ?? 0;
  const mobilityDone = state.mobilityLogs.some((m) => m.date === today && m.completed);

  const keyProgression = session.exercises.find((e) => e.suggestion?.action === "subir");

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Hola, ${state.profile.name.split(" ")[0]}`}
        subtitle="Tu Sistema está activo. Hora de cazar."
      />

      {/* XP / nivel */}
      <Card glow>
        <XPBar xp={state.rpg.xp} />
      </Card>

      {/* Entrenamiento de hoy */}
      <Card glow>
        <div className="mb-1 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-widest text-hunter-cyan">Hoy toca</p>
          <Pill tone="violet">
            Día {session.index + 1}/{session.totalDays || 0}
          </Pill>
        </div>
        {session.template ? (
          <>
            <h2 className="text-xl font-bold text-white">{session.template.name}</h2>
            <p className="text-sm text-slate-400">{session.template.description}</p>
            <div className="mt-3 space-y-1">
              {session.exercises.slice(0, 3).map((e) => (
                <p key={e.we.exerciseId} className="text-sm text-slate-300">
                  • {e.exercise?.name}{" "}
                  <span className="text-hunter-cyan">
                    {e.workingWeight > 0 ? `${e.workingWeight}kg` : ""} × {e.we.targetReps}
                  </span>
                </p>
              ))}
              {session.exercises.length > 3 && (
                <p className="text-xs text-slate-500">+{session.exercises.length - 3} ejercicios más</p>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Pill tone="blue">XP posible: {session.potentialXp}</Pill>
              <Pill tone="amber">{session.exercises.length} ejercicios</Pill>
            </div>
            <Link
              href="/workout/today"
              className="mt-4 block w-full rounded-xl bg-gradient-to-r from-hunter-blue to-hunter-violet py-3 text-center font-bold text-white shadow-glow active:scale-[0.98]"
            >
              ⚔ Empezar entrenamiento
            </Link>
          </>
        ) : (
          <p className="text-sm text-slate-400">No hay rutina asignada. Configurá tu semana.</p>
        )}
      </Card>

      {/* Boss semanal */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-white">👹 {missions.boss.name.replace("Boss: ", "")}</p>
            <p className="text-xs text-slate-400">{missions.boss.description}</p>
          </div>
          <span className="text-sm font-bold text-hunter-cyan">
            {missions.boss.progress}/{missions.boss.goal}
          </span>
        </div>
        <div className="mt-2">
          <ProgressBar value={missions.boss.progress ?? 0} max={missions.boss.goal ?? 1} color="violet" />
        </div>
      </Card>

      {/* Grid de estado */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-[11px] uppercase tracking-widest text-slate-400">Racha</p>
          <p className="text-2xl font-black text-white">
            🔥 {state.rpg.streaks.workout}
            <span className="text-sm font-medium text-slate-400"> días</span>
          </p>
        </Card>
        <Card>
          <p className="text-[11px] uppercase tracking-widest text-slate-400">Semana</p>
          <p className="text-2xl font-black text-white">
            {weekCount}
            <span className="text-sm font-medium text-slate-400"> / {state.weekPlan.daysAvailable}</span>
          </p>
        </Card>
      </div>

      {/* Proteína */}
      <Link href="/nutrition">
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">🥩 Proteína de hoy</p>
            <span className="text-sm text-slate-300">
              {Math.round(protein)}/{state.profile.proteinTarget} g
            </span>
          </div>
          <div className="mt-2">
            <ProgressBar
              value={protein}
              max={state.profile.proteinTarget}
              color={protein >= state.profile.proteinTarget ? "green" : "blue"}
            />
          </div>
        </Card>
      </Link>

      {/* Movilidad pendiente */}
      {!mobilityDone && (
        <Link href="/mobility">
          <Card>
            <p className="text-sm font-semibold text-white">🧘 Movilidad pendiente</p>
            <p className="text-xs text-slate-400">
              Hacé tu rutina de cadera/lumbar/cuello y sumá +15 XP.
            </p>
          </Card>
        </Link>
      )}

      {/* Mapa muscular semanal */}
      <Card>
        <p className="mb-3 text-sm font-bold text-white">Mapa muscular de la semana</p>
        <WeeklyMuscleMap trained={trained} pending={pending} />
      </Card>

      {/* Próxima progresión importante */}
      {keyProgression && (
        <Card>
          <p className="text-[11px] uppercase tracking-widest text-green-400">Próxima progresión</p>
          <p className="text-sm text-slate-200">
            {keyProgression.exercise?.name}:{" "}
            <span className="font-semibold text-green-300">
              subir a {keyProgression.suggestion?.newWeight}kg
            </span>
          </p>
        </Card>
      )}
    </div>
  );
}
