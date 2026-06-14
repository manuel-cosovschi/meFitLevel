"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore, type SaveWorkoutResult } from "@/lib/store";
import { getTodaySession } from "@/lib/selectors";
import type { ExerciseLog, SetLog, SymptomKey, Exercise } from "@/lib/types";
import ExerciseCard from "@/components/ExerciseCard";
import WorkoutSummary from "@/components/WorkoutSummary";
import PainWarningModal from "@/components/PainWarningModal";
import LevelUpModal from "@/components/LevelUpModal";
import { Card, PageHeader, Pill } from "@/components/ui";

function initialLogs(exercises: ReturnType<typeof getTodaySession>["exercises"]): ExerciseLog[] {
  return exercises.map((se) => ({
    exerciseId: se.we.exerciseId,
    sets: se.sets.map<SetLog>((p, i) => ({
      setNumber: i + 1,
      kind: p.kind,
      targetWeight: p.weight,
      actualWeight: p.weight,
      targetReps: p.reps,
      targetRepsMax: p.repsMax,
      actualReps: p.reps,
      targetRir: p.rir,
      actualRir: p.rir,
      completed: false,
    })),
  }));
}

export default function TodayWorkoutPage() {
  const saveWorkout = useStore((s) => s.saveWorkout);
  const session = useMemo(() => getTodaySession(useStore.getState()), []);

  const [logs, setLogs] = useState<ExerciseLog[]>(() => initialLogs(session.exercises));
  const [symptoms, setSymptoms] = useState<SymptomKey[]>([]);
  const [showPain, setShowPain] = useState(false);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<SaveWorkoutResult | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const updateSet = (exIdx: number, setIdx: number, partial: Partial<SetLog>) => {
    setLogs((prev) =>
      prev.map((el, i) =>
        i === exIdx
          ? { ...el, sets: el.sets.map((s, j) => (j === setIdx ? { ...s, ...partial } : s)) }
          : el,
      ),
    );
  };

  const swap = (exIdx: number, alt: Exercise) => {
    setLogs((prev) =>
      prev.map((el, i) => (i === exIdx ? { ...el, swapped: true, swappedFor: alt.id } : el)),
    );
  };

  const toggleSymptom = (k: SymptomKey) =>
    setSymptoms((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const totalSets = logs.reduce((a, el) => a + el.sets.length, 0);
  const doneSets = logs.reduce((a, el) => a + el.sets.filter((s) => s.completed).length, 0);
  const anyPain = logs.some((el) => el.sets.some((s) => s.painFlag)) || symptoms.length > 0;

  const handleSave = () => {
    if (!session.template) return;
    const duration = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
    const res = saveWorkout({
      templateId: session.template.id,
      templateName: session.template.name,
      focus: session.template.focus,
      muscleGroups: session.template.muscleGroups,
      duration,
      exercisesLogged: logs,
      symptoms,
      notes: notes.trim() || undefined,
    });
    setResult(res);
    if (res.leveledUp) setShowLevelUp(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (result) {
    return (
      <>
        <WorkoutSummary result={result} />
        {showLevelUp && (
          <LevelUpModal
            level={result.toLevel}
            newTitles={result.newTitles}
            onClose={() => setShowLevelUp(false)}
          />
        )}
      </>
    );
  }

  if (!session.template) {
    return (
      <div className="space-y-4">
        <PageHeader title="Entrenamiento de hoy" />
        <Card>
          <p className="text-sm text-slate-300">
            No hay rutina asignada para hoy (día de descanso o plan vacío).
          </p>
          <Link href="/routines" className="mt-3 block text-sm font-semibold text-hunter-cyan">
            Configurar rutinas →
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      <PageHeader
        title={session.template.name}
        subtitle={session.template.description}
        right={<Pill tone="blue">{doneSets}/{totalSets} series</Pill>}
      />

      {anyPain && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-sm text-red-200">
          ⚠ Marcaste molestia/síntoma. No sigas con intensidad. Reducí o cortá la sesión si es fuerte.
        </div>
      )}

      {session.exercises.map((se, i) => (
        <ExerciseCard
          key={se.we.exerciseId + i}
          session={se}
          log={logs[i]}
          index={i}
          onUpdateSet={(setIdx, partial) => updateSet(i, setIdx, partial)}
          onSwap={(alt) => swap(i, alt)}
        />
      ))}

      <Card>
        <p className="mb-2 text-sm font-semibold text-white">Nota de la sesión</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Energía, polea defectuosa, cómo te sentiste…"
          className="w-full resize-none rounded-xl border border-line bg-bg-elev px-3 py-2 text-sm text-white placeholder:text-slate-500"
        />
      </Card>

      <button
        onClick={() => setShowPain(true)}
        className="w-full rounded-xl border border-red-500/30 bg-red-500/5 py-2.5 text-sm font-semibold text-red-300 active:scale-[0.98]"
      >
        ⚠ Control de dolor / síntomas {symptoms.length > 0 && `(${symptoms.length})`}
      </button>

      {/* Barra fija de guardar */}
      <div className="safe-bottom fixed inset-x-0 bottom-20 z-30 mx-auto w-full max-w-md px-4">
        <button
          onClick={handleSave}
          className="w-full rounded-2xl bg-gradient-to-r from-hunter-blue to-hunter-violet py-4 text-center font-bold text-white shadow-glow active:scale-[0.98]"
        >
          Guardar entrenamiento · {doneSets}/{totalSets}
        </button>
      </div>

      {showPain && (
        <PainWarningModal selected={symptoms} onToggle={toggleSymptom} onClose={() => setShowPain(false)} />
      )}
    </div>
  );
}
