# 🗡️ Hunter Gym System

PWA **mobile-first** y **local-first** para registrar, planificar y progresar tu
entrenamiento de gimnasio, con sistema de niveles, XP, rangos y misiones estilo
**Solo Leveling**. Pensada para usarse desde el iPhone como app instalada en la
pantalla de inicio.

> Diseño oscuro/premium · azul eléctrico + violeta · cards con glow · barras de
> progreso · animaciones sutiles. Se siente como un “Sistema de cazador”.

---

## ✨ Funcionalidades (MVP)

1. **Dashboard** — qué toca hoy, estado semanal, mapa muscular, XP/nivel, racha,
   proteína, movilidad pendiente, próxima progresión y boss semanal.
2. **Entrenamiento de hoy** — registro ultra-rápido de cada serie (peso, reps,
   RIR) con botones grandes `+/−`, flags de *fallé / fácil / dolor* y cambio de
   ejercicio si la máquina está ocupada (alternativas sugeridas).
3. **Cálculo automático de progresión** — algoritmo de **doble progresión** que
   decide subir, mantener, bajar o hacer deload para la próxima sesión.
4. **Rutinas editables** — semana regular ideal de 5 días + reestructuración
   automática para semanas de 2/3/4/5 días.
5. **Historial** — sesiones con volumen, series efectivas, PRs, síntomas y notas.
6. **Progreso** — gráficos de volumen semanal, frecuencia, series por grupo
   muscular, progresión por ejercicio y peso corporal.
7. **Sistema RPG** — nivel, XP, rango (E→National), stats, títulos, logros,
   misiones diarias/semanales, boss semanal y streaks.
8. **Proteína diaria** — objetivo de 180 g, registro rápido con alimentos AR.
9. **Movilidad** — rutinas cortas (cadera, lumbar, isquios, cuello) con XP.
10. **Core/abs** — integrado en las rutinas y en el sistema de XP.
11. **Mediciones** — peso, medidas, energía, sueño y dolores.
12. **PWA instalable** — manifest, service worker, iconos, offline básico,
    safe-area para el notch y guía de instalación en iPhone.

---

## 🧠 Algoritmo de sobrecarga progresiva

Cada ejercicio tiene una **regla** (`lib/data/progressionRules.ts`) con rango de
reps, RIR objetivo, incremento y si se permite fallo. Tras guardar una sesión,
`lib/progression.ts` analiza las series de trabajo y decide:

| Situación | Acción |
|---|---|
| Completó el **rango alto** con RIR ≥ objetivo | **Subir** peso (+incremento) |
| Dentro de rango pero sin llegar al tope | **Mantener** y buscar más reps |
| Debajo del **mínimo** de reps, o RIR 0 cuando debía ser conservador, o fallo en compuesto | **Bajar** 5–10% / backoff |
| 2 sesiones seguidas con bajo rendimiento o dolor | **Deload** sugerido |
| Marca **dolor/molestia** | Reduce carga + alerta de seguridad |

- Evita fallo en compuestos; lo permite en aislados (laterales, curl, tríceps…).
- Detecta **PRs** por 1RM estimado (Epley).
- El peso recomendado se guarda como *override* por ejercicio y se aplica a la
  próxima sesión desplazando toda la carga (sin tocar el calentamiento).

### Semanas irregulares

En `lib/scheduler.ts`, según los días disponibles se prioriza
**piernas/glúteos → torso completo → hombros/brazos → core**:

- **2 días:** Lower A · Torso A
- **3 días:** Torso A · Lower A · Torso B
- **4 días:** Torso A · Lower A · Torso B · Lower B
- **5 días:** + Día Opcional (Delts + Arms + Glute Pump + Abs)

---

## 🎮 Sistema RPG

- **Niveles/XP** con curva creciente (`lib/data/rpg.ts`).
- **Rangos:** E, D, C, B, A, S, *National Level Hunter*.
- **XP:** +50 entrenar · +10 registrar todo · +20 proteína · +15 movilidad ·
  +25 abs · +30 progresar · +300 PR.
- **Stats:** Strength, Hypertrophy, Endurance, Mobility, Discipline, Core,
  Upper/Lower Body, Recovery (cada grupo muscular sube stats).
- **Misiones** diarias/semanales + **Boss semanal** (“Derrotar la Semana Irregular”).
- **Títulos** y **logros** desbloqueables, **streaks** y animación de *level up*.

---

## 🧱 Stack y arquitectura

- **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.
- **Local-first**: estado en `localStorage` vía **Zustand** + `persist`
  (`lib/store.ts`). Tipado completo en `lib/types.ts`.
- **Preparado para sync**: toda entidad tiene `id`; el store está aislado para
  migrar a **Supabase/Firebase** sin reescribir la UI.
- **PWA**: `public/manifest.webmanifest`, `public/sw.js`, iconos en
  `public/icons/` (generados por `scripts/generate-icons.mjs`, sin dependencias).

```
app/                 rutas (dashboard, workout, progress, rpg, nutrition, …)
components/          UI (ExerciseCard, SetLogger, XPBar, LevelUpModal, …)
lib/
  data/             exercises, templates, progressionRules, mobility, foods, rpg
  types.ts          modelo de datos completo
  store.ts          estado Zustand + acciones
  progression.ts    algoritmo de sobrecarga progresiva
  rpg.ts            XP / niveles / misiones / logros
  scheduler.ts      distribución semanal 2–5 días
  selectors.ts      sesión de hoy, mapa muscular semanal
  safety.ts         alertas de síntomas
public/             manifest, service worker, offline, iconos
```

### Editar rutinas / ejercicios / pesos

Todo es editable desde código de forma simple:

- **Ejercicios y pesos base:** `lib/data/exercises.ts`
- **Rutinas y series prescritas:** `lib/data/templates.ts`
- **Reglas de progresión:** `lib/data/progressionRules.ts`
- **Movilidad / alimentos / RPG:** `lib/data/*.ts`

Desde la UI ya se puede cambiar los días de la semana, marcar el día de hoy y
**duplicar plantillas**. La edición completa de plantillas desde la UI queda
preparada en el store (`updateTemplate`).

---

## 🚀 Correr localmente

Requisitos: **Node 18.18+** (recomendado 20/22).

```bash
npm install
npm run icons     # (opcional) regenerar iconos PWA
npm run dev       # http://localhost:3000
```

Build de producción:

```bash
npm run build
npm start
```

> El service worker solo se registra en producción (evita cache molesto en dev).

---

## 📲 Instalar en iPhone (Add to Home Screen)

1. Abrí la web en **Safari**.
2. Tocá **Compartir** (cuadrado con flecha ↑).
3. Elegí **“Agregar a pantalla de inicio”**.
4. Confirmá. El ícono del Sistema aparece como app nativa (pantalla completa,
   theme oscuro, safe-area para el notch).

En Android: menú ⋮ → **Instalar app**.

---

## ▲ Deploy en Vercel

1. Subí el repo a GitHub.
2. En [vercel.com](https://vercel.com) → **New Project** → importá el repo.
3. Framework: **Next.js** (autodetectado). No requiere variables de entorno.
4. **Deploy**. Vercel sirve la PWA con HTTPS (necesario para el service worker).

También funciona con `vercel` CLI:

```bash
npm i -g vercel
vercel        # preview
vercel --prod # producción
```

---

## 🔒 Datos y privacidad

- **100% local** en tu dispositivo (localStorage). Sin login ni backend.
- **Backup/restore**: Configuración → Exportar/Importar JSON.
- **Reiniciar**: Configuración → Zona peligrosa.

---

## ⚠️ Aviso de seguridad

La app incluye alertas ante síntomas (dolor de cabeza súbito, mareo, dolor de
pecho, lumbar irradiado, hormigueo, etc.) que recomiendan **detener el
entrenamiento**. Esto **no reemplaza atención médica**: ante un síntoma fuerte,
súbito o raro, consultá con un profesional.

---

## 🗺️ Roadmap (post-MVP)

- Edición completa de plantillas/ejercicios desde la UI.
- Sync opcional con Supabase + login.
- Notificaciones push reales (estructura ya preparada).
- Fotos de progreso y más métricas de recuperación.

*Hunter Gym System — MVP local-first. Nombre temporal.*
