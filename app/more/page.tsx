"use client";

import { PageHeader, LinkCard } from "@/components/ui";
import InstallPWAInstructions from "@/components/InstallPWAInstructions";

export default function MorePage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Más" subtitle="Hunter Gym System" />

      <div className="space-y-2.5">
        <LinkCard href="/workout/today" icon="⚔️" title="Entrenamiento de hoy" subtitle="Registrar series" />
        <LinkCard href="/workout/history" icon="📜" title="Historial" subtitle="Sesiones anteriores" />
        <LinkCard href="/routines" icon="🗂️" title="Rutinas" subtitle="Plan semanal y plantillas" />
        <LinkCard href="/exercises" icon="🏋️" title="Ejercicios" subtitle="Catálogo y pesos base" />
        <LinkCard href="/nutrition" icon="🥩" title="Proteína" subtitle="Objetivo diario" />
        <LinkCard href="/mobility" icon="🧘" title="Movilidad" subtitle="Rutinas de flexibilidad" />
        <LinkCard href="/measurements" icon="📐" title="Mediciones" subtitle="Peso, medidas, energía, dolor" />
        <LinkCard href="/settings" icon="⚙️" title="Configuración" subtitle="Perfil, datos, exportar" />
      </div>

      <InstallPWAInstructions />
    </div>
  );
}
