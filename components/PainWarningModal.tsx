"use client";

import { SYMPTOMS, SAFETY_MESSAGE, isSevere } from "@/lib/safety";
import type { SymptomKey } from "@/lib/types";

export default function PainWarningModal({
  selected,
  onToggle,
  onClose,
}: {
  selected: SymptomKey[];
  onToggle: (k: SymptomKey) => void;
  onClose: () => void;
}) {
  const severe = isSevere(selected);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-3xl border border-red-500/40 bg-bg-soft p-5 shadow-[0_0_30px_rgba(239,68,68,0.3)] sm:rounded-3xl">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          <h2 className="text-lg font-bold text-red-300">Control de síntomas</h2>
        </div>

        <p className="mb-4 text-sm text-slate-300">
          Marcá si sentís alguno de estos síntomas. La app no reemplaza atención médica.
        </p>

        <div className="grid grid-cols-1 gap-2">
          {SYMPTOMS.map((sym) => {
            const active = selected.includes(sym.key);
            return (
              <button
                key={sym.key}
                onClick={() => onToggle(sym.key)}
                className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                  active
                    ? "border-red-500/60 bg-red-500/15 text-red-200"
                    : "border-line bg-bg-elev text-slate-300"
                }`}
              >
                <span>{sym.label}</span>
                {sym.severe && <span className="text-[10px] text-red-400">crítico</span>}
              </button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <div
            className={`mt-4 rounded-xl border p-3 text-sm ${
              severe
                ? "border-red-500/60 bg-red-500/15 text-red-200"
                : "border-amber-500/50 bg-amber-500/10 text-amber-200"
            }`}
          >
            {SAFETY_MESSAGE}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-bg-elev py-3 font-semibold text-white active:scale-[0.98]"
        >
          Listo
        </button>
      </div>
    </div>
  );
}
