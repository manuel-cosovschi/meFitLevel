"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { todayKey } from "@/lib/utils";
import { QUICK_MEALS, FOODS } from "@/lib/data/foods";
import { Card, ProgressBar } from "@/components/ui";

export default function ProteinTracker() {
  const target = useStore((s) => s.profile.proteinTarget);
  const logs = useStore((s) => s.nutritionLogs);
  const addMeal = useStore((s) => s.addMeal);
  const removeMeal = useStore((s) => s.removeMeal);

  const today = todayKey();
  const log = logs.find((n) => n.date === today);
  const consumed = log?.proteinConsumed ?? 0;
  const remaining = Math.max(0, target - consumed);

  const [food, setFood] = useState(FOODS[1].name);
  const [grams, setGrams] = useState(150);

  const customProtein = () => {
    const item = FOODS.find((f) => f.name === food);
    if (!item) return 0;
    return Math.round((item.proteinPer100g * grams) / 100);
  };

  return (
    <div className="space-y-4">
      <Card glow>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Proteína de hoy</p>
            <p className="text-3xl font-black text-white">
              {Math.round(consumed)}
              <span className="text-base font-medium text-slate-400"> / {target} g</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Faltan</p>
            <p className="text-xl font-bold text-hunter-cyan">{remaining} g</p>
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar value={consumed} max={target} color={consumed >= target ? "green" : "blue"} />
        </div>
        {consumed >= target && (
          <p className="mt-2 text-xs font-semibold text-green-400">✓ Objetivo cumplido · +20 XP en el próximo entreno</p>
        )}
      </Card>

      <Card>
        <p className="mb-2 text-sm font-semibold text-white">Agregar rápido</p>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_MEALS.map((m) => (
            <button
              key={m.food}
              onClick={() => addMeal({ food: m.food, protein: m.protein })}
              className="flex items-center justify-between rounded-xl border border-line bg-bg-elev px-3 py-2.5 text-left text-sm transition active:scale-[0.97]"
            >
              <span className="text-slate-200">
                {m.emoji} {m.food}
              </span>
              <span className="font-semibold text-hunter-cyan">+{m.protein}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <p className="mb-2 text-sm font-semibold text-white">Por alimento y gramos</p>
        <div className="flex items-center gap-2">
          <select
            value={food}
            onChange={(e) => setFood(e.target.value)}
            className="flex-1 rounded-xl border border-line bg-bg-elev px-3 py-2.5 text-sm text-white"
          >
            {FOODS.map((f) => (
              <option key={f.name} value={f.name}>
                {f.emoji} {f.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={grams}
            onChange={(e) => setGrams(Number(e.target.value))}
            className="w-20 rounded-xl border border-line bg-bg-elev px-3 py-2.5 text-center text-sm text-white"
          />
          <span className="text-xs text-slate-400">g</span>
        </div>
        <button
          onClick={() => {
            const item = FOODS.find((f) => f.name === food);
            if (item) addMeal({ food: `${food} (${grams}g)`, grams, protein: customProtein() });
          }}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-hunter-blue to-hunter-violet py-2.5 text-sm font-semibold text-white active:scale-[0.98]"
        >
          Agregar {customProtein()} g de proteína
        </button>
      </Card>

      {log && log.meals.length > 0 && (
        <Card>
          <p className="mb-2 text-sm font-semibold text-white">Comidas de hoy</p>
          <div className="space-y-1.5">
            {log.meals.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-lg bg-bg-elev px-3 py-2 text-sm"
              >
                <span className="text-slate-200">{m.food}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-hunter-cyan">{m.protein} g</span>
                  <button onClick={() => removeMeal(m.id)} className="text-slate-500">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
