import type { MobilityRoutine } from "@/lib/types";

// =============================================================
// Rutinas de movilidad / flexibilidad.
// Prioridad: cadera, lumbar, isquios, glúteos, flexores de cadera,
// espalda torácica, cuello, hombros, tobillos.
// =============================================================

export const MOBILITY_ROUTINES: MobilityRoutine[] = [
  {
    id: "nocturna",
    name: "Rutina base nocturna",
    description: "Movilidad global para cadera, lumbar, isquios y cuello antes de dormir.",
    totalMinutes: 12,
    steps: [
      { name: "Respiración 90/90", detail: "Reset de costillas y pelvis", duration: "2 min" },
      { name: "Cat-cow", detail: "Movilidad de columna", duration: "1x10" },
      { name: "Figura 4", detail: "Glúteo / cadera", duration: "40s por lado" },
      { name: "Couch stretch", detail: "Flexor de cadera / cuádriceps", duration: "40s por lado" },
      { name: "Isquios con apoyo", detail: "Cadena posterior", duration: "40s por lado" },
      { name: "Child pose lateral", detail: "Dorsal / lumbar", duration: "40s por lado" },
      { name: "Open book", detail: "Espalda torácica", duration: "1x6 por lado" },
      { name: "Chin tucks", detail: "Cuello / cervical", duration: "2x10" },
    ],
  },
  {
    id: "cadera_express",
    name: "Cadera express",
    description: "Rutina corta enfocada en cadera y glúteos para días de pierna.",
    totalMinutes: 6,
    steps: [
      { name: "90/90 transiciones", detail: "Rotación de cadera", duration: "1x8 por lado" },
      { name: "Figura 4", detail: "Glúteo", duration: "40s por lado" },
      { name: "Couch stretch", detail: "Flexor de cadera", duration: "40s por lado" },
      { name: "Sentadilla profunda sostenida", detail: "Apertura de cadera", duration: "60s" },
    ],
  },
  {
    id: "espalda_cuello",
    name: "Espalda alta y cuello",
    description: "Para días de torso o trabajo de escritorio.",
    totalMinutes: 6,
    steps: [
      { name: "Open book", detail: "Torácica", duration: "1x8 por lado" },
      { name: "Cat-cow", detail: "Columna", duration: "1x10" },
      { name: "Estiramiento de pecho en marco", detail: "Pectoral / hombro", duration: "40s por lado" },
      { name: "Chin tucks", detail: "Cervical", duration: "2x10" },
    ],
  },
];
