"use client";

import { useStore } from "@/lib/store";

// Evita mismatch de hidratación: el store se rehidrata desde localStorage
// en el cliente. Mostramos un loader tipo "sistema" hasta estar listos.
export default function HydrationGate({ children }: { children: React.ReactNode }) {
  const hydrated = useStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <div className="h-12 w-12 animate-pulse-glow rounded-xl border border-hunter-blue/50 bg-bg-card" />
        <p className="text-sm tracking-widest text-hunter-cyan animate-pulse">
          INICIANDO SISTEMA…
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
