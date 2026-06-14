"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type IconProps = { active: boolean };

const stroke = (active: boolean) => ({
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

function HomeIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke(active)}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </svg>
  );
}

function SwordIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke(active)}>
      <path d="M14.5 4 20 4l0 5.5L9.5 20 4 20l0-5.5z" />
      <path d="M14.5 9.5 9.5 14.5" />
    </svg>
  );
}

function ChartIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke(active)}>
      <path d="M4 4v16h16" />
      <path d="M8 14l3-3 2 2 4-5" />
    </svg>
  );
}

function SystemIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke(active)}>
      <path d="M12 3l2.2 5.6L20 9l-4 4 1 6-5-2.8L7 19l1-6-4-4 5.8-.4z" />
    </svg>
  );
}

function MoreIcon({ active }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke(active)}>
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

const ITEMS: { href: string; label: string; Icon: (p: IconProps) => JSX.Element }[] = [
  { href: "/", label: "Inicio", Icon: HomeIcon },
  { href: "/workout/today", label: "Hoy", Icon: SwordIcon },
  { href: "/progress", label: "Progreso", Icon: ChartIcon },
  { href: "/rpg", label: "Sistema", Icon: SystemIcon },
  { href: "/more", label: "Más", Icon: MoreIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md">
      <div className="glass mx-3 mb-3 flex items-center justify-around rounded-2xl border border-line px-1 py-2 shadow-glow-soft">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-medium transition ${
                active ? "text-hunter-cyan" : "text-slate-400"
              }`}
            >
              <span className={active ? "drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]" : ""}>
                <Icon active={active} />
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
