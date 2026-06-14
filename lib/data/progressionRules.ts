import type { ProgressionRule } from "@/lib/types";

// =============================================================
// Reglas de progresión por ejercicio (doble progresión).
// increment = kg a subir cuando se completa el rango alto con RIR ok.
// Compuestos: incrementos mayores; aislados: incrementos finos.
// =============================================================

export const PROGRESSION_RULES: ProgressionRule[] = [
  // Torso
  { exerciseId: "press_inclinado_smith", progressionType: "doble_progresion", increment: 2.5, minReps: 6, maxReps: 8, rirTarget: 1, allowFailure: false },
  { exerciseId: "press_inclinado_mancuernas", progressionType: "doble_progresion", increment: 2.5, minReps: 6, maxReps: 8, rirTarget: 1, allowFailure: false },
  { exerciseId: "press_pecho_maquina", progressionType: "doble_progresion", increment: 5, minReps: 8, maxReps: 12, rirTarget: 1, allowFailure: false },
  { exerciseId: "peck_deck", progressionType: "doble_progresion", increment: 5, minReps: 8, maxReps: 12, rirTarget: 1, allowFailure: true },
  { exerciseId: "remo_hammer_pecho_apoyado", progressionType: "doble_progresion", increment: 5, minReps: 8, maxReps: 10, rirTarget: 1, allowFailure: false },
  { exerciseId: "jalon_cerrado_neutro", progressionType: "doble_progresion", increment: 1, minReps: 8, maxReps: 12, rirTarget: 1, allowFailure: false },
  { exerciseId: "depresiones_dorsal", progressionType: "doble_progresion", increment: 5, minReps: 8, maxReps: 12, rirTarget: 1, allowFailure: true },
  { exerciseId: "remo_polea_neutro", progressionType: "doble_progresion", increment: 5, minReps: 8, maxReps: 12, rirTarget: 1, allowFailure: false },
  { exerciseId: "dominadas_asistidas", progressionType: "doble_progresion", increment: 2.5, minReps: 6, maxReps: 10, rirTarget: 1, allowFailure: false },
  { exerciseId: "vuelos_laterales", progressionType: "doble_progresion", increment: 1, minReps: 12, maxReps: 15, rirTarget: 0, allowFailure: true },
  { exerciseId: "vuelos_laterales_polea", progressionType: "doble_progresion", increment: 1, minReps: 12, maxReps: 15, rirTarget: 0, allowFailure: true },
  { exerciseId: "lateral_maquina", progressionType: "doble_progresion", increment: 2.5, minReps: 12, maxReps: 15, rirTarget: 0, allowFailure: true },
  { exerciseId: "face_pulls", progressionType: "doble_progresion", increment: 2.5, minReps: 12, maxReps: 15, rirTarget: 1, allowFailure: true },
  { exerciseId: "pajaros_posteriores", progressionType: "doble_progresion", increment: 2.5, minReps: 12, maxReps: 15, rirTarget: 0, allowFailure: true },
  { exerciseId: "encogimientos_trapecio", progressionType: "doble_progresion", increment: 2.5, minReps: 10, maxReps: 15, rirTarget: 1, allowFailure: true },
  { exerciseId: "curl_barra_w", progressionType: "doble_progresion", increment: 2.5, minReps: 8, maxReps: 12, rirTarget: 0, allowFailure: true },
  { exerciseId: "curl_martillo", progressionType: "doble_progresion", increment: 2.5, minReps: 8, maxReps: 12, rirTarget: 0, allowFailure: true },
  { exerciseId: "curl_polea", progressionType: "doble_progresion", increment: 2.5, minReps: 10, maxReps: 15, rirTarget: 0, allowFailure: true },
  { exerciseId: "triceps_soga", progressionType: "doble_progresion", increment: 2.5, minReps: 8, maxReps: 12, rirTarget: 0, allowFailure: true },
  { exerciseId: "triceps_barra", progressionType: "doble_progresion", increment: 2.5, minReps: 8, maxReps: 12, rirTarget: 0, allowFailure: true },
  { exerciseId: "fondos_maquina", progressionType: "doble_progresion", increment: 5, minReps: 8, maxReps: 12, rirTarget: 1, allowFailure: false },
  // Core
  { exerciseId: "abs_polea_crunch", progressionType: "doble_progresion", increment: 5, minReps: 10, maxReps: 15, rirTarget: 1, allowFailure: true },
  { exerciseId: "elevaciones_piernas", progressionType: "doble_progresion", increment: 0, minReps: 10, maxReps: 20, rirTarget: 1, allowFailure: true },
  { exerciseId: "dead_bug", progressionType: "doble_progresion", increment: 0, minReps: 8, maxReps: 12, rirTarget: 2, allowFailure: false },
  { exerciseId: "pallof_press", progressionType: "doble_progresion", increment: 2.5, minReps: 8, maxReps: 12, rirTarget: 2, allowFailure: false },
  // Pierna
  { exerciseId: "prensa", progressionType: "doble_progresion", increment: 10, minReps: 8, maxReps: 10, rirTarget: 1, allowFailure: false },
  { exerciseId: "hack_squat", progressionType: "doble_progresion", increment: 5, minReps: 8, maxReps: 10, rirTarget: 1, allowFailure: false },
  { exerciseId: "sentadilla_smith", progressionType: "doble_progresion", increment: 5, minReps: 8, maxReps: 10, rirTarget: 1, allowFailure: false },
  { exerciseId: "hip_thrust", progressionType: "doble_progresion", increment: 5, minReps: 8, maxReps: 10, rirTarget: 1, allowFailure: false },
  { exerciseId: "patada_gluteo_polea", progressionType: "doble_progresion", increment: 2.5, minReps: 10, maxReps: 15, rirTarget: 1, allowFailure: true },
  { exerciseId: "puente_gluteo", progressionType: "doble_progresion", increment: 5, minReps: 8, maxReps: 12, rirTarget: 1, allowFailure: false },
  { exerciseId: "peso_muerto_rumano_mancuernas", progressionType: "doble_progresion", increment: 2.5, minReps: 8, maxReps: 10, rirTarget: 2, allowFailure: false },
  { exerciseId: "extension_cuadriceps", progressionType: "doble_progresion", increment: 1, minReps: 10, maxReps: 12, rirTarget: 1, allowFailure: true },
  { exerciseId: "curl_femoral", progressionType: "doble_progresion", increment: 5, minReps: 8, maxReps: 12, rirTarget: 1, allowFailure: true },
  { exerciseId: "abductores", progressionType: "doble_progresion", increment: 5, minReps: 15, maxReps: 20, rirTarget: 1, allowFailure: true },
  { exerciseId: "aductores", progressionType: "doble_progresion", increment: 5, minReps: 10, maxReps: 12, rirTarget: 1, allowFailure: true },
  { exerciseId: "gemelos_smith", progressionType: "doble_progresion", increment: 2.5, minReps: 12, maxReps: 15, rirTarget: 0, allowFailure: true },
  { exerciseId: "gemelos_prensa", progressionType: "doble_progresion", increment: 5, minReps: 12, maxReps: 15, rirTarget: 0, allowFailure: true },
];

export const ruleFor = (exerciseId: string): ProgressionRule | undefined =>
  PROGRESSION_RULES.find((r) => r.exerciseId === exerciseId);
