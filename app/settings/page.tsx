"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, PageHeader } from "@/components/ui";
import InstallPWAInstructions from "@/components/InstallPWAInstructions";

function Field({
  label,
  value,
  onChange,
  type = "text",
  suffix,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  suffix?: string;
}) {
  return (
    <label className="block text-xs text-slate-400">
      {label}
      <div className="mt-1 flex items-center gap-2">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-line bg-bg-elev px-3 py-2.5 text-sm text-white"
        />
        {suffix && <span className="text-xs text-slate-500">{suffix}</span>}
      </div>
    </label>
  );
}

export default function SettingsPage() {
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const exportData = useStore((s) => s.exportData);
  const importData = useStore((s) => s.importData);
  const resetAll = useStore((s) => s.resetAll);

  const [importText, setImportText] = useState("");
  const [msg, setMsg] = useState("");

  const doExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hunter-gym-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Backup descargado ✓");
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Configuración" subtitle="Perfil y datos" />

      <Card>
        <p className="mb-3 text-sm font-bold text-white">Perfil</p>
        <div className="space-y-3">
          <Field label="Nombre" value={profile.name} onChange={(v) => setProfile({ name: v })} />
          <div className="grid grid-cols-3 gap-2">
            <Field label="Edad" type="number" value={profile.age} onChange={(v) => setProfile({ age: Number(v) })} />
            <Field label="Altura" type="number" suffix="cm" value={profile.height} onChange={(v) => setProfile({ height: Number(v) })} />
            <Field label="Peso" type="number" suffix="kg" value={profile.weight} onChange={(v) => setProfile({ weight: Number(v) })} />
          </div>
          <Field
            label="Objetivo de proteína"
            type="number"
            suffix="g/día"
            value={profile.proteinTarget}
            onChange={(v) => setProfile({ proteinTarget: Number(v) })}
          />
          <label className="block text-xs text-slate-400">
            Lesiones / notas
            <textarea
              value={profile.injuriesOrNotes}
              onChange={(e) => setProfile({ injuriesOrNotes: e.target.value })}
              rows={3}
              className="mt-1 w-full resize-none rounded-lg border border-line bg-bg-elev px-3 py-2.5 text-sm text-white"
            />
          </label>
        </div>
      </Card>

      <Card>
        <p className="mb-2 text-sm font-bold text-white">Objetivos físicos</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.goals.map((g) => (
            <span key={g} className="rounded-full border border-hunter-blue/30 bg-hunter-blue/10 px-2.5 py-1 text-[11px] text-hunter-cyan">
              {g}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <p className="mb-2 text-sm font-bold text-white">Datos (local-first)</p>
        <p className="mb-3 text-xs text-slate-400">
          Todo se guarda en tu dispositivo (localStorage). Exportá un backup o migralo a otro equipo.
          La arquitectura está preparada para sincronizar con Supabase/Firebase más adelante.
        </p>
        <button
          onClick={doExport}
          className="w-full rounded-xl bg-bg-elev py-2.5 text-sm font-semibold text-hunter-cyan active:scale-[0.98]"
        >
          ⬇ Exportar datos (JSON)
        </button>

        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          rows={3}
          placeholder="Pegá un backup JSON para importar…"
          className="mt-3 w-full resize-none rounded-xl border border-line bg-bg-elev px-3 py-2 text-xs text-white placeholder:text-slate-500"
        />
        <button
          onClick={() => {
            const ok = importData(importText);
            setMsg(ok ? "Datos importados ✓" : "JSON inválido ✗");
            if (ok) setImportText("");
          }}
          className="mt-2 w-full rounded-xl bg-bg-elev py-2.5 text-sm font-semibold text-slate-300 active:scale-[0.98]"
        >
          ⬆ Importar datos
        </button>

        {msg && <p className="mt-2 text-center text-xs text-green-400">{msg}</p>}
      </Card>

      <Card>
        <p className="mb-2 text-sm font-bold text-red-300">Zona peligrosa</p>
        <button
          onClick={() => {
            if (confirm("¿Borrar TODO y reiniciar el sistema? Esto no se puede deshacer.")) {
              resetAll();
              setMsg("Sistema reiniciado");
            }
          }}
          className="w-full rounded-xl border border-red-500/40 bg-red-500/10 py-2.5 text-sm font-semibold text-red-300 active:scale-[0.98]"
        >
          Reiniciar todos los datos
        </button>
      </Card>

      <InstallPWAInstructions />

      <p className="pb-4 text-center text-[11px] text-slate-600">Hunter Gym System · MVP local-first</p>
    </div>
  );
}
