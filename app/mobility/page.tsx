"use client";

import { PageHeader, Card } from "@/components/ui";
import MobilityChecklist from "@/components/MobilityChecklist";

export default function MobilityPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Movilidad" subtitle="Cadera · lumbar · isquios · cuello" />
      <Card>
        <p className="text-sm text-slate-300">
          Prioridades: cadera, espalda baja, isquios, glúteos, flexores de cadera, espalda torácica,
          cuello, hombros y tobillos. Completá una rutina y sumá XP.
        </p>
      </Card>
      <MobilityChecklist />
    </div>
  );
}
