"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Card, PageHeader, EmptyState } from "@/components/ui";

const FIELDS: { key: string; label: string; suffix?: string }[] = [
  { key: "weight", label: "Peso corporal", suffix: "kg" },
  { key: "waist", label: "Cintura", suffix: "cm" },
  { key: "chest", label: "Pecho", suffix: "cm" },
  { key: "arm", label: "Brazo", suffix: "cm" },
  { key: "leg", label: "Pierna", suffix: "cm" },
  { key: "glutes", label: "Glúteos", suffix: "cm" },
];

const SCALES: { key: string; label: string }[] = [
  { key: "energy", label: "Energía (1-5)" },
  { key: "sleep", label: "Sueño (1-5)" },
  { key: "lowBackPain", label: "Dolor lumbar (0-5)" },
  { key: "neckPain", label: "Dolor cervical (0-5)" },
  { key: "kneePain", label: "Dolor rodilla (0-5)" },
  { key: "headache", label: "Dolor cabeza (0-5)" },
];

export default function MeasurementsPage() {
  const measurements = useStore((s) => s.measurements);
  const addMeasurement = useStore((s) => s.addMeasurement);
  const [form, setForm] = useState<Record<string, number | undefined>>({});
  const [notes, setNotes] = useState("");

  const set = (k: string, v: string) =>
    setForm((f) => ({ ...f, [k]: v === "" ? undefined : Number(v) }));

  const save = () => {
    const hasData = Object.values(form).some((v) => v != null) || notes.trim();
    if (!hasData) return;
    addMeasurement({ ...(form as any), notes: notes.trim() || undefined });
    setForm({});
    setNotes("");
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Mediciones" subtitle="Cuerpo · energía · dolor" />

      <Card>
        <p className="mb-3 text-sm font-bold text-white">Nuevo registro</p>
        <div className="grid grid-cols-2 gap-2">
          {FIELDS.map((f) => (
            <label key={f.key} className="text-xs text-slate-400">
              {f.label}
              <div className="mt-1 flex items-center gap-1">
                <input
                  type="number"
                  value={form[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="w-full rounded-lg border border-line bg-bg-elev px-2.5 py-2 text-sm text-white"
                />
                {f.suffix && <span className="text-[10px] text-slate-500">{f.suffix}</span>}
              </div>
            </label>
          ))}
        </div>

        <p className="mb-2 mt-4 text-xs font-semibold text-slate-300">Energía / sueño / dolor</p>
        <div className="grid grid-cols-2 gap-2">
          {SCALES.map((f) => (
            <label key={f.key} className="text-xs text-slate-400">
              {f.label}
              <select
                value={form[f.key] ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-bg-elev px-2.5 py-2 text-sm text-white"
              >
                <option value="">—</option>
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Notas…"
          className="mt-3 w-full resize-none rounded-xl border border-line bg-bg-elev px-3 py-2 text-sm text-white placeholder:text-slate-500"
        />

        <button
          onClick={save}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-hunter-blue to-hunter-violet py-2.5 text-sm font-semibold text-white active:scale-[0.98]"
        >
          Guardar medición
        </button>
      </Card>

      {measurements.length === 0 ? (
        <EmptyState icon="📐" text="Registrá tus medidas para seguir tu evolución física." />
      ) : (
        <Card>
          <p className="mb-2 text-sm font-bold text-white">Historial</p>
          <div className="space-y-2">
            {measurements.map((m) => (
              <div key={m.id} className="rounded-lg bg-bg-elev px-3 py-2 text-sm">
                <p className="text-xs font-semibold text-hunter-cyan">{formatDate(m.date)}</p>
                <p className="text-xs text-slate-300">
                  {m.weight != null && `Peso ${m.weight}kg `}
                  {m.waist != null && `· Cintura ${m.waist} `}
                  {m.arm != null && `· Brazo ${m.arm} `}
                  {m.energy != null && `· Energía ${m.energy}/5 `}
                  {m.lowBackPain ? `· Lumbar ${m.lowBackPain}/5` : ""}
                </p>
                {m.notes && <p className="text-[11px] italic text-slate-400">{m.notes}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
