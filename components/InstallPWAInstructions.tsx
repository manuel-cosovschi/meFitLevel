"use client";

import { Card } from "@/components/ui";

export default function InstallPWAInstructions() {
  return (
    <Card glow>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xl">📲</span>
        <h2 className="font-bold text-white">Instalar en iPhone</h2>
      </div>
      <ol className="space-y-2 text-sm text-slate-300">
        <li className="flex gap-2">
          <span className="font-bold text-hunter-cyan">1.</span>
          <span>Abrí esta web en <b>Safari</b>.</span>
        </li>
        <li className="flex gap-2">
          <span className="font-bold text-hunter-cyan">2.</span>
          <span>
            Tocá <b>Compartir</b> <span className="text-slate-400">(el cuadrado con la flecha ↑)</span>.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="font-bold text-hunter-cyan">3.</span>
          <span>Elegí <b>“Agregar a pantalla de inicio”</b>.</span>
        </li>
        <li className="flex gap-2">
          <span className="font-bold text-hunter-cyan">4.</span>
          <span>Confirmá. El ícono del Sistema aparece como app.</span>
        </li>
      </ol>
      <p className="mt-3 text-xs text-slate-500">
        En Android: menú ⋮ → “Instalar app”. Funciona offline una vez cargada.
      </p>
    </Card>
  );
}
