import type {
  ProgressionRule,
  ProgressionSuggestion,
  ExerciseLog,
  SetLog,
  WorkoutExercise,
  PrescribedSet,
  WorkoutLog,
} from "@/lib/types";
import { ruleFor } from "@/lib/data/progressionRules";
import { round05, clamp } from "@/lib/utils";

// =============================================================
// ALGORITMO DE SOBRECARGA PROGRESIVA (doble progresión).
// =============================================================

// 1RM estimado (Epley) para comparar PRs.
export function estimate1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  return weight * (1 + reps / 30);
}

// Sets de trabajo reales (excluye calentamiento).
function workingSets(log: ExerciseLog): SetLog[] {
  const objetivo = log.sets.filter((s) => s.completed && s.kind === "objetivo");
  if (objetivo.length > 0) return objetivo;
  return log.sets.filter((s) => s.completed && s.kind !== "calentamiento");
}

// Peso de trabajo del ejercicio en esta sesión (el más pesado de las series objetivo).
export function sessionWorkingWeight(log: ExerciseLog): number {
  const w = workingSets(log).map((s) => s.actualWeight);
  return w.length ? Math.max(...w) : 0;
}

/**
 * Analiza el desempeño de un ejercicio en una sesión y decide la carga
 * para la próxima vez. Implementa las reglas pedidas:
 *  1. Doble progresión -> subir.
 *  2. Dentro de rango sin tope -> mantener y buscar más reps.
 *  3. Debajo del mínimo o RIR0 cuando el objetivo era 2-3 -> bajar 5-10%.
 *  5. Evitar fallo en compuestos (no recomienda subir si hubo fallo).
 *  6. Dolor -> recomienda reducir.
 */
export function analyzeExercise(
  log: ExerciseLog,
  prevWorkingWeight: number,
  ruleArg?: ProgressionRule,
): ProgressionSuggestion {
  const rule = ruleArg ?? ruleFor(log.exerciseId);
  const base =
    sessionWorkingWeight(log) || prevWorkingWeight || 0;
  const exerciseId = log.exerciseId;

  if (!rule) {
    return {
      exerciseId,
      action: "mantener",
      newWeight: base,
      prevWeight: base,
      message: "Sin regla de progresión: mantené la carga y registrá.",
    };
  }

  const sets = workingSets(log);
  const pain = log.sets.some((s) => s.painFlag);
  const failed = log.sets.some((s) => s.failed);

  // Series realizadas con el peso de trabajo (con margen de 1.5 kg).
  const topSets = sets.filter((s) => s.actualWeight >= base - 1.5);
  const consider = topSets.length ? topSets : sets;

  const reps = consider.map((s) => s.actualReps);
  const minDone = reps.length ? Math.min(...reps) : 0;
  const allHitMax =
    consider.length > 0 &&
    consider.every((s) => s.actualReps >= rule.maxReps && s.actualRir >= rule.rirTarget);
  const belowMin = minDone > 0 && minDone < rule.minReps;
  const overReached =
    rule.rirTarget >= 2 && consider.some((s) => s.actualRir === 0) && !rule.allowFailure;

  // 6. Dolor
  if (pain) {
    const newWeight = round05(clamp(base * 0.9, 0, base));
    return {
      exerciseId,
      action: "deload",
      prevWeight: base,
      newWeight,
      message: `Marcaste molestia. Próxima vez bajá a ${newWeight} kg y priorizá técnica/rango.`,
    };
  }

  // 3. Bajar
  if (belowMin || overReached || (failed && !rule.allowFailure)) {
    const factor = belowMin ? 0.9 : 0.93;
    const newWeight = round05(clamp(base * factor, 0, base));
    const reason = belowMin
      ? `Quedaste por debajo de ${rule.minReps} reps`
      : failed
      ? "Hubo fallo en un compuesto"
      : "RIR 0 cuando el objetivo era más conservador";
    return {
      exerciseId,
      action: "bajar",
      prevWeight: base,
      newWeight,
      message: `${reason}. Bajá a ${newWeight} kg (o usá backoff) y consolidá.`,
    };
  }

  // 1. Subir (doble progresión completada)
  if (allHitMax && !failed) {
    const newWeight = round05(base + rule.increment);
    return {
      exerciseId,
      action: "subir",
      prevWeight: base,
      newWeight,
      message: `¡Rango alto completado con RIR ok! Subí a ${newWeight} kg la próxima vez.`,
    };
  }

  // 2. Mantener y buscar más reps
  return {
    exerciseId,
    action: "mantener_subir_reps",
    prevWeight: base,
    newWeight: round05(base),
    message: `Mantené ${round05(base)} kg y buscá llegar a ${rule.maxReps} reps en todas las series.`,
  };
}

/**
 * Deload automático: si en las últimas 2 sesiones del ejercicio el
 * rendimiento bajó (acción "bajar"/"deload") o hubo dolor, recomienda deload.
 */
export function needsDeload(exerciseId: string, logs: WorkoutLog[]): boolean {
  const sessions: ExerciseLog[] = [];
  for (const wl of [...logs].reverse()) {
    const el = wl.exercisesLogged.find((e) => e.exerciseId === exerciseId);
    if (el) sessions.push(el);
    if (sessions.length >= 2) break;
  }
  if (sessions.length < 2) return false;
  return sessions.every((el) => {
    const pain = el.sets.some((s) => s.painFlag);
    const rule = ruleFor(exerciseId);
    if (!rule) return false;
    const sets = workingSets(el);
    const belowMin = sets.some((s) => s.actualReps < rule.minReps);
    return pain || belowMin;
  });
}

/** Detecta un PR (mejora de 1RM estimado) frente al historial previo. */
export function detectPR(
  log: ExerciseLog,
  history: WorkoutLog[],
): { isPR: boolean; description?: string } {
  const best = Math.max(
    0,
    ...workingSets(log).map((s) => estimate1RM(s.actualWeight, s.actualReps)),
  );
  let prevBest = 0;
  for (const wl of history) {
    const el = wl.exercisesLogged.find((e) => e.exerciseId === log.exerciseId);
    if (!el) continue;
    for (const set of el.sets) {
      if (set.completed) prevBest = Math.max(prevBest, estimate1RM(set.actualWeight, set.actualReps));
    }
  }
  if (best > prevBest + 0.5 && prevBest > 0) {
    const topSet = workingSets(log).reduce((a, b) =>
      estimate1RM(b.actualWeight, b.actualReps) > estimate1RM(a.actualWeight, a.actualReps) ? b : a,
    );
    return {
      isPR: true,
      description: `${topSet.actualWeight}kg x ${topSet.actualReps} (1RM est. ${Math.round(best)}kg)`,
    };
  }
  return { isPR: false };
}

/**
 * Construye las series de hoy a partir de la plantilla aplicando el
 * peso de trabajo recomendado (override). Desplaza toda la sesión por el
 * delta respecto al peso sugerido original, salvo el calentamiento.
 */
export function buildSessionSets(
  we: WorkoutExercise,
  workingWeight: number,
): PrescribedSet[] {
  const delta = round05(workingWeight - we.suggestedWeight);
  if (delta === 0) return we.sets.map((x) => ({ ...x }));
  return we.sets.map((set) => {
    if (set.kind === "calentamiento") return { ...set };
    return { ...set, weight: round05(Math.max(0, set.weight + delta)) };
  });
}
