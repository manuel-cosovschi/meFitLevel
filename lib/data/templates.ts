import type { WorkoutTemplate, PrescribedSet, MuscleGroup } from "@/lib/types";

// Helper para crear sets prescritos de forma compacta.
const s = (
  kind: PrescribedSet["kind"],
  weight: number,
  reps: number,
  repsMax: number | undefined,
  rir: number,
): PrescribedSet => ({ kind, weight, reps, repsMax, rir });

// =============================================================
// Plantillas base (rutina regular ideal de 5 días).
// Los pesos iniciales replican los registros reales del usuario
// y las "siguientes sugerencias conservadoras".
// =============================================================

export const TEMPLATES: WorkoutTemplate[] = [
  {
    id: "torso_a",
    name: "Torso A",
    focus: "torso_a",
    description: "Pecho superior · Espalda · Hombro lateral · Brazos · Abs",
    muscleGroups: ["pecho_superior", "espalda", "dorsal", "hombro_lateral", "biceps", "triceps", "core"],
    exercises: [
      {
        exerciseId: "press_inclinado_smith",
        targetReps: "6-8",
        targetRir: 1,
        suggestedWeight: 30,
        sets: [
          s("calentamiento", 20, 10, undefined, 4),
          s("aproximacion", 25, 8, undefined, 2),
          s("objetivo", 30, 8, undefined, 1),
          s("objetivo", 30, 6, 8, 0),
          s("backoff", 27.5, 8, 10, 1),
        ],
      },
      {
        exerciseId: "remo_hammer_pecho_apoyado",
        targetReps: "8-10",
        targetRir: 1,
        suggestedWeight: 30,
        sets: [
          s("calentamiento", 25, 10, undefined, 3),
          s("objetivo", 30, 8, undefined, 1),
          s("objetivo", 30, 8, undefined, 1),
        ],
      },
      {
        exerciseId: "jalon_cerrado_neutro",
        targetReps: "8-12",
        targetRir: 1,
        suggestedWeight: 15,
        notes: "Polea defectuosa: si se pegan las placas, anotarlo.",
        sets: [
          s("calentamiento", 14, 8, undefined, 3),
          s("objetivo", 15, 8, 10, 1),
          s("objetivo", 15, 8, 10, 1),
          s("backoff", 14, 10, 12, 1),
        ],
      },
      {
        exerciseId: "vuelos_laterales",
        targetReps: "12-15",
        targetRir: 0,
        suggestedWeight: 5,
        sets: [
          s("objetivo", 5, 15, undefined, 1),
          s("objetivo", 5, 12, 15, 0),
          s("objetivo", 5, 10, 12, 0),
          s("dropset", 5, 8, 12, 0),
        ],
      },
      {
        exerciseId: "curl_barra_w",
        targetReps: "8-12",
        targetRir: 0,
        suggestedWeight: 30,
        sets: [
          s("calentamiento", 25, 12, undefined, 2),
          s("objetivo", 30, 8, 10, 0),
          s("objetivo", 30, 8, 10, 0),
        ],
      },
      {
        exerciseId: "triceps_soga",
        targetReps: "8-12",
        targetRir: 0,
        suggestedWeight: 45,
        sets: [
          s("calentamiento", 40, 12, undefined, 2),
          s("objetivo", 45, 8, 10, 0),
          s("objetivo", 45, 8, 10, 0),
        ],
      },
      {
        exerciseId: "abs_polea_crunch",
        targetReps: "10-15",
        targetRir: 1,
        suggestedWeight: 55,
        sets: [
          s("objetivo", 45, 15, undefined, 2),
          s("objetivo", 50, 12, undefined, 1),
          s("objetivo", 55, 10, 12, 0),
        ],
      },
    ],
  },
  {
    id: "lower_a",
    name: "Lower A",
    focus: "lower_a",
    description: "Cuádriceps · Glúteos · Femoral · Abductores · Gemelos · Core",
    muscleGroups: ["cuadriceps", "gluteo", "femoral", "abductor", "gemelo", "core"],
    exercises: [
      {
        exerciseId: "prensa",
        targetReps: "8-10",
        targetRir: 1,
        suggestedWeight: 160,
        sets: [
          s("calentamiento", 100, 10, undefined, 4),
          s("aproximacion", 140, 8, undefined, 2),
          s("objetivo", 160, 8, 10, 1),
          s("objetivo", 160, 8, 10, 1),
          s("backoff", 140, 10, 12, 1),
        ],
      },
      {
        exerciseId: "hip_thrust",
        targetReps: "8-10",
        targetRir: 1,
        suggestedWeight: 35,
        notes: "Subir a 40 cuando logres 35x10 / 35x10 / 35x10.",
        sets: [
          s("calentamiento", 20, 10, undefined, 4),
          s("aproximacion", 30, 8, undefined, 2),
          s("objetivo", 35, 10, undefined, 1),
          s("objetivo", 35, 8, 10, 1),
          s("objetivo", 35, 8, 10, 1),
        ],
      },
      {
        exerciseId: "curl_femoral",
        targetReps: "8-12",
        targetRir: 1,
        suggestedWeight: 50,
        sets: [
          s("objetivo", 45, 10, 12, 2),
          s("objetivo", 50, 8, 10, 1),
          s("objetivo", 50, 8, 10, 1),
          s("backoff", 45, 10, 12, 1),
        ],
      },
      {
        exerciseId: "extension_cuadriceps",
        targetReps: "10-12",
        targetRir: 1,
        suggestedWeight: 13,
        sets: [
          s("objetivo", 12, 12, undefined, 2),
          s("objetivo", 13, 10, 12, 1),
          s("objetivo", 14, 10, undefined, 0),
        ],
      },
      {
        exerciseId: "abductores",
        targetReps: "15-20",
        targetRir: 1,
        suggestedWeight: 50,
        sets: [
          s("objetivo", 50, 15, undefined, 1),
          s("objetivo", 50, 15, undefined, 1),
          s("objetivo", 50, 15, 20, 0),
        ],
      },
      {
        exerciseId: "gemelos_smith",
        targetReps: "12-15",
        targetRir: 0,
        suggestedWeight: 25,
        sets: [
          s("objetivo", 20, 15, undefined, 1),
          s("objetivo", 20, 12, 15, 0),
          s("objetivo", 25, 10, 12, 0),
        ],
      },
      {
        exerciseId: "dead_bug",
        targetReps: "8-12",
        targetRir: 2,
        suggestedWeight: 0,
        sets: [
          s("objetivo", 0, 10, undefined, 2),
          s("objetivo", 0, 10, undefined, 2),
          s("objetivo", 0, 10, undefined, 2),
        ],
      },
    ],
  },
  {
    id: "torso_b",
    name: "Torso B",
    focus: "torso_b",
    description: "Espalda V · Hombros 3D · Pecho accesorio · Trapecio · Brazos · Abs",
    muscleGroups: ["dorsal", "espalda", "hombro_lateral", "hombro_posterior", "pecho", "trapecio", "biceps", "triceps", "core"],
    exercises: [
      {
        exerciseId: "jalon_cerrado_neutro",
        targetReps: "8-12",
        targetRir: 1,
        suggestedWeight: 15,
        sets: [
          s("calentamiento", 14, 8, undefined, 3),
          s("objetivo", 15, 8, 10, 1),
          s("objetivo", 15, 8, 10, 1),
          s("backoff", 14, 10, 12, 1),
        ],
      },
      {
        exerciseId: "depresiones_dorsal",
        targetReps: "8-12",
        targetRir: 1,
        suggestedWeight: 55,
        sets: [
          s("calentamiento", 50, 12, undefined, 2),
          s("objetivo", 55, 8, 10, 1),
          s("objetivo", 55, 8, 10, 1),
        ],
      },
      {
        exerciseId: "vuelos_laterales",
        targetReps: "12-15",
        targetRir: 0,
        suggestedWeight: 5,
        sets: [
          s("objetivo", 5, 15, undefined, 1),
          s("objetivo", 5, 12, 15, 0),
          s("objetivo", 5, 10, 12, 0),
          s("dropset", 5, 8, 12, 0),
        ],
      },
      {
        exerciseId: "face_pulls",
        targetReps: "12-15",
        targetRir: 1,
        suggestedWeight: 35,
        sets: [
          s("objetivo", 35, 15, undefined, 1),
          s("objetivo", 35, 12, 15, 1),
          s("objetivo", 35, 12, 15, 1),
        ],
      },
      {
        exerciseId: "peck_deck",
        targetReps: "8-12",
        targetRir: 1,
        suggestedWeight: 70,
        sets: [
          s("objetivo", 65, 12, undefined, 2),
          s("objetivo", 70, 10, undefined, 1),
          s("objetivo", 70, 8, 10, 0),
        ],
      },
      {
        exerciseId: "curl_martillo",
        targetReps: "8-12",
        targetRir: 0,
        suggestedWeight: 12.5,
        sets: [
          s("objetivo", 10, 10, undefined, 1),
          s("objetivo", 12.5, 8, 10, 0),
          s("objetivo", 12.5, 8, 10, 0),
        ],
      },
      {
        exerciseId: "abs_polea_crunch",
        targetReps: "10-15",
        targetRir: 1,
        suggestedWeight: 55,
        sets: [
          s("objetivo", 45, 15, undefined, 2),
          s("objetivo", 50, 12, undefined, 1),
          s("objetivo", 55, 10, 12, 0),
        ],
      },
    ],
  },
  {
    id: "lower_b",
    name: "Lower B",
    focus: "lower_b",
    description: "Glúteos · Femorales · Pierna completa · Aductores/Abductores · Gemelos · Core",
    muscleGroups: ["gluteo", "femoral", "cuadriceps", "aductor", "abductor", "gemelo", "core"],
    exercises: [
      {
        exerciseId: "hip_thrust",
        targetReps: "8-10",
        targetRir: 1,
        suggestedWeight: 35,
        sets: [
          s("calentamiento", 20, 10, undefined, 4),
          s("aproximacion", 30, 8, undefined, 2),
          s("objetivo", 35, 10, undefined, 1),
          s("objetivo", 35, 8, 10, 1),
          s("objetivo", 35, 8, 10, 1),
        ],
      },
      {
        exerciseId: "peso_muerto_rumano_mancuernas",
        targetReps: "8-10",
        targetRir: 2,
        suggestedWeight: 22.5,
        sets: [
          s("calentamiento", 15, 10, undefined, 4),
          s("objetivo", 22.5, 10, undefined, 2),
          s("objetivo", 22.5, 8, undefined, 2),
          s("objetivo", 22.5, 8, undefined, 1),
        ],
      },
      {
        exerciseId: "prensa",
        targetReps: "8-10",
        targetRir: 1,
        suggestedWeight: 160,
        sets: [
          s("calentamiento", 100, 10, undefined, 4),
          s("aproximacion", 140, 8, undefined, 2),
          s("objetivo", 160, 8, 10, 1),
          s("backoff", 140, 10, 12, 1),
        ],
      },
      {
        exerciseId: "aductores",
        targetReps: "10-12",
        targetRir: 1,
        suggestedWeight: 45,
        sets: [
          s("objetivo", 40, 12, undefined, 2),
          s("objetivo", 45, 10, 12, 1),
          s("objetivo", 45, 10, 12, 1),
        ],
      },
      {
        exerciseId: "abductores",
        targetReps: "15-20",
        targetRir: 1,
        suggestedWeight: 50,
        sets: [
          s("objetivo", 50, 15, undefined, 1),
          s("objetivo", 50, 15, undefined, 1),
          s("objetivo", 50, 15, 20, 0),
        ],
      },
      {
        exerciseId: "gemelos_smith",
        targetReps: "12-15",
        targetRir: 0,
        suggestedWeight: 25,
        sets: [
          s("objetivo", 20, 15, undefined, 1),
          s("objetivo", 20, 12, 15, 0),
          s("objetivo", 25, 10, 12, 0),
        ],
      },
      {
        exerciseId: "pallof_press",
        targetReps: "8-12",
        targetRir: 2,
        suggestedWeight: 10,
        sets: [
          s("objetivo", 10, 10, undefined, 2),
          s("objetivo", 10, 10, undefined, 2),
          s("objetivo", 10, 10, undefined, 2),
        ],
      },
    ],
  },
  {
    id: "opcional",
    name: "Día Opcional — Delts + Arms + Glute Pump + Abs",
    focus: "opcional",
    description: "Hombros · Brazos · Glúteo pump · Abs · Movilidad",
    muscleGroups: ["hombro_lateral", "hombro_posterior", "biceps", "triceps", "gluteo", "core"],
    exercises: [
      {
        exerciseId: "vuelos_laterales",
        targetReps: "12-15",
        targetRir: 0,
        suggestedWeight: 5,
        sets: [
          s("objetivo", 5, 15, undefined, 1),
          s("objetivo", 5, 12, 15, 0),
          s("objetivo", 5, 10, 12, 0),
          s("dropset", 5, 8, 12, 0),
        ],
      },
      {
        exerciseId: "face_pulls",
        targetReps: "12-15",
        targetRir: 1,
        suggestedWeight: 35,
        sets: [
          s("objetivo", 35, 15, undefined, 1),
          s("objetivo", 35, 12, 15, 1),
        ],
      },
      {
        exerciseId: "curl_barra_w",
        targetReps: "8-12",
        targetRir: 0,
        suggestedWeight: 30,
        sets: [
          s("objetivo", 25, 12, undefined, 1),
          s("objetivo", 30, 8, 10, 0),
          s("objetivo", 30, 8, 10, 0),
        ],
      },
      {
        exerciseId: "triceps_soga",
        targetReps: "8-12",
        targetRir: 0,
        suggestedWeight: 45,
        sets: [
          s("objetivo", 40, 12, undefined, 1),
          s("objetivo", 45, 8, 10, 0),
          s("objetivo", 45, 8, 10, 0),
        ],
      },
      {
        exerciseId: "patada_gluteo_polea",
        targetReps: "12-15",
        targetRir: 1,
        suggestedWeight: 25,
        sets: [
          s("objetivo", 20, 15, undefined, 2),
          s("objetivo", 25, 12, 15, 1),
          s("objetivo", 25, 12, 15, 0),
        ],
      },
      {
        exerciseId: "abs_polea_crunch",
        targetReps: "10-15",
        targetRir: 1,
        suggestedWeight: 55,
        sets: [
          s("objetivo", 45, 15, undefined, 2),
          s("objetivo", 50, 12, undefined, 1),
          s("objetivo", 55, 10, undefined, 0),
        ],
      },
    ],
  },
];
