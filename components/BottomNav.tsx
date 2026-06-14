"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS: { href: string; label: string; icon: string }[] = [
  { href: "/", label: "Inicio", icon: "⌂" },
  { href: "/workout/today", label: "Hoy", icon: "⚔" },
  { href: "/progress", label: "Progreso", icon: "📈" },
  { href: "/rpg", label: "Sistema", icon: "✦" },
  { href: "/more", label: "Más", icon: "⋯" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md">
      <div className="glass mx-3 mb-3 flex items-center justify-around rounded-2xl border border-line px-1 py-2 shadow-glow-soft">
        {ITEMS.map((it) => {
          const active = isActive(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium transition ${
                active ? "text-hunter-cyan" : "text-slate-400"
              }`}
            >
              <span
                className={`text-lg leading-none ${
                  active ? "drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]" : ""
                }`}
              >
                {it.icon}
              </span>
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
