import type { SymptomKey } from "@/lib/types";

// =============================================================
// Sistema de alertas de seguridad.
// NO reemplaza atención médica: ayuda a tomar decisiones prudentes.
// =============================================================

export const SYMPTOMS: { key: SymptomKey; label: string; severe: boolean }[] = [
  { key: "dolor_cabeza", label: "Dolor de cabeza súbito", severe: true },
  { key: "dolor_nuca", label: "Dolor en la nuca", severe: true },
  { key: "mareo", label: "Mareo", severe: true },
  { key: "vision_borrosa", label: "Visión borrosa", severe: true },
  { key: "dolor_pecho", label: "Dolor de pecho", severe: true },
  { key: "dolor_lumbar", label: "Dolor lumbar irradiado", severe: true },
  { key: "hormigueo", label: "Hormigueo", severe: true },
  { key: "dolor_articular", label: "Dolor articular fuerte", severe: false },
  { key: "dolor_rodilla", label: "Dolor agudo de rodilla", severe: false },
];

export const symptomLabel = (key: SymptomKey): string =>
  SYMPTOMS.find((s) => s.key === key)?.label ?? key;

export function isSevere(keys: SymptomKey[]): boolean {
  return keys.some((k) => SYMPTOMS.find((s) => s.key === k)?.severe);
}

export const SAFETY_MESSAGE =
  "Detené el entrenamiento. No sigas con intensidad. Si el síntoma es súbito, fuerte o raro, consultá con un profesional. Esto no reemplaza atención médica.";

export const PAIN_MESSAGE =
  "No continuar con intensidad. Reducí o cortá la sesión. Consultá un profesional si persiste.";
