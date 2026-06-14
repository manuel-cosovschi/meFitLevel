// =============================================================
// Hunter Gym System — Tipos de datos (arquitectura local-first)
// =============================================================
// Estos tipos definen TODO el modelo de datos. Están pensados para
// poder migrar a Supabase/Firebase sin reescribir la lógica: cada
// entidad tiene id propio y el store persiste en localStorage.

export type MuscleGroup =
  | "pecho"
  | "pecho_superior"
  | "espalda"
  | "dorsal"
  | "trapecio"
  | "hombro_lateral"
  | "hombro_posterior"
  | "hombro_frontal"
  | "biceps"
  | "triceps"
  | "cuadriceps"
  | "femoral"
  | "gluteo"
  | "aductor"
  | "abductor"
  | "gemelo"
  | "core"
  | "movilidad";

export type ExerciseType = "compuesto" | "aislado" | "core" | "movilidad";

export type SessionFocus =
  | "torso_a"
  | "lower_a"
  | "torso_b"
  | "lower_b"
  | "opcional"
  | "custom";

// ---- Perfil del usuario ----
export interface UserProfile {
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  proteinTarget: number; // g/día
  goals: string[];
  injuriesOrNotes: string;
}

// ---- Ejercicio (catálogo) ----
export interface Exercise {
  id: string;
  name: string;
  category: string; // ej "Pecho", "Pierna", "Hombro"
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  type: ExerciseType;
  defaultRest: number; // segundos
  alternatives: string[]; // ids de ejercicios alternativos
  notes?: string;
  priority?: 1 | 2 | 3; // 1 = alta prioridad
}

// ---- Set prescrito dentro de una plantilla ----
export interface PrescribedSet {
  kind: "calentamiento" | "aproximacion" | "objetivo" | "backoff" | "dropset";
  weight: number; // kg sugeridos
  reps: number; // objetivo central
  repsMax?: number; // tope del rango (si hay rango)
  rir: number; // RIR objetivo
}

// ---- Ejercicio dentro de una plantilla de entrenamiento ----
export interface WorkoutExercise {
  exerciseId: string;
  sets: PrescribedSet[];
  targetReps: string; // rango legible "8-10"
  targetRir: number;
  suggestedWeight: number; // peso de trabajo principal
  notes?: string;
}

// ---- Plantilla de entrenamiento ----
export interface WorkoutTemplate {
  id: string;
  name: string;
  focus: SessionFocus;
  description?: string;
  exercises: WorkoutExercise[];
  muscleGroups: MuscleGroup[];
}

// ---- Registro de una serie ----
export interface SetLog {
  setNumber: number;
  kind: PrescribedSet["kind"];
  targetWeight: number;
  actualWeight: number;
  targetReps: number;
  targetRepsMax?: number;
  actualReps: number;
  targetRir: number;
  actualRir: number;
  completed: boolean;
  failed?: boolean;
  tooEasy?: boolean;
  painFlag?: boolean;
  notes?: string;
}

// ---- Ejercicio registrado en una sesión ----
export interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
  swapped?: boolean; // cambiado por máquina ocupada
  swappedFor?: string; // id alternativo usado
  notes?: string;
}

// ---- Síntomas / alertas de seguridad ----
export type SymptomKey =
  | "dolor_cabeza"
  | "dolor_nuca"
  | "mareo"
  | "vision_borrosa"
  | "dolor_lumbar"
  | "hormigueo"
  | "dolor_articular"
  | "dolor_rodilla"
  | "dolor_pecho";

// ---- Registro completo de entrenamiento ----
export interface WorkoutLog {
  id: string;
  date: string; // ISO
  templateId: string;
  templateName: string;
  focus: SessionFocus;
  duration: number; // minutos
  exercisesLogged: ExerciseLog[];
  totalVolume: number; // kg*reps
  effectiveSets: number;
  xpEarned: number;
  prs: string[]; // descripciones de PRs
  symptoms: SymptomKey[];
  notes?: string;
  muscleGroups: MuscleGroup[];
}

// ---- Regla de progresión por ejercicio ----
export interface ProgressionRule {
  exerciseId: string;
  progressionType: "doble_progresion" | "lineal";
  increment: number; // kg a subir
  minReps: number;
  maxReps: number;
  rirTarget: number;
  allowFailure: boolean; // permitir fallo (aislados)
}

// ---- Sugerencia calculada para la próxima sesión ----
export interface ProgressionSuggestion {
  exerciseId: string;
  action: "subir" | "mantener_subir_reps" | "bajar" | "deload" | "mantener";
  newWeight: number;
  message: string;
  prevWeight: number;
}

// ---- RPG ----
export type Rank = "E" | "D" | "C" | "B" | "A" | "S" | "National";

export interface RPGStats {
  strength: number;
  hypertrophy: number;
  endurance: number;
  mobility: number;
  discipline: number;
  core: number;
  upperBody: number;
  lowerBody: number;
  recovery: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
}

export interface Title {
  id: string;
  name: string;
  unlocked: boolean;
}

export interface Streaks {
  workout: number;
  protein: number;
  mobility: number;
  lastWorkoutDate?: string;
  lastProteinDate?: string;
  lastMobilityDate?: string;
}

export interface Mission {
  id: string;
  type: "diaria" | "semanal" | "boss";
  name: string;
  description: string;
  xp: number;
  done: boolean;
  progress?: number;
  goal?: number;
}

export interface RPGProfile {
  level: number;
  xp: number; // xp total acumulada
  xpThisWeek: number;
  rank: Rank;
  titles: Title[];
  activeTitle?: string;
  stats: RPGStats;
  achievements: Achievement[];
  streaks: Streaks;
}

// ---- Nutrición ----
export interface MealEntry {
  id: string;
  food: string;
  grams?: number;
  protein: number; // g
}

export interface NutritionLog {
  date: string; // YYYY-MM-DD
  proteinTarget: number;
  proteinConsumed: number;
  meals: MealEntry[];
}

export interface FoodItem {
  name: string;
  proteinPer100g: number;
  emoji: string;
}

// ---- Movilidad ----
export interface MobilityStep {
  name: string;
  detail: string;
  duration: string;
}

export interface MobilityRoutine {
  id: string;
  name: string;
  description: string;
  steps: MobilityStep[];
  totalMinutes: number;
}

export interface MobilityLog {
  date: string; // YYYY-MM-DD
  routineId: string;
  completed: boolean;
  duration: number; // min
}

// ---- Mediciones personales ----
export interface BodyMeasurement {
  id: string;
  date: string;
  weight?: number;
  waist?: number;
  chest?: number;
  arm?: number;
  leg?: number;
  glutes?: number;
  energy?: number; // 1-5
  sleep?: number; // 1-5
  lowBackPain?: number; // 0-5
  neckPain?: number;
  kneePain?: number;
  headache?: number;
  notes?: string;
}

// ---- Plan semanal (regular o irregular) ----
export interface WeekPlan {
  weekStart: string; // YYYY-MM-DD (lunes)
  daysAvailable: number; // 2-5
  templateIds: string[]; // plantillas asignadas en orden
}

// ---- Estado raíz persistido ----
export interface AppState {
  version: number;
  profile: UserProfile;
  exercises: Exercise[];
  templates: WorkoutTemplate[];
  progressionRules: ProgressionRule[];
  workoutLogs: WorkoutLog[];
  rpg: RPGProfile;
  nutritionLogs: NutritionLog[];
  mobilityLogs: MobilityLog[];
  mobilityRoutines: MobilityRoutine[];
  measurements: BodyMeasurement[];
  weekPlan: WeekPlan;
  // índice de la plantilla "de hoy" dentro del weekPlan
  todayIndex: number;
  // peso de trabajo recomendado por ejercicio (derivado de la progresión)
  weightOverrides: Record<string, number>;
  // última sugerencia calculada por ejercicio (para mostrar en UI)
  lastSuggestions: Record<string, ProgressionSuggestion>;
}
