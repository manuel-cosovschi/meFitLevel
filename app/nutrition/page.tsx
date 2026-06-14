"use client";

import { PageHeader } from "@/components/ui";
import ProteinTracker from "@/components/ProteinTracker";

export default function NutritionPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Proteína" subtitle="Objetivo diario · alimentos AR" />
      <ProteinTracker />
    </div>
  );
}
