import type { FoodItem } from "@/lib/types";

// Alimentos frecuentes en Argentina con proteína aproximada por 100 g.
export const FOODS: FoodItem[] = [
  { name: "Huevo (unidad ~6g)", proteinPer100g: 13, emoji: "🥚" },
  { name: "Pechuga de pollo", proteinPer100g: 31, emoji: "🍗" },
  { name: "Carne magra (nalga/peceto)", proteinPer100g: 27, emoji: "🥩" },
  { name: "Carne picada magra", proteinPer100g: 21, emoji: "🍖" },
  { name: "Atún al natural", proteinPer100g: 26, emoji: "🐟" },
  { name: "Merluza", proteinPer100g: 18, emoji: "🐠" },
  { name: "Yogur alto en proteína", proteinPer100g: 10, emoji: "🥛" },
  { name: "Queso magro / port salut light", proteinPer100g: 24, emoji: "🧀" },
  { name: "Arroz cocido", proteinPer100g: 2.5, emoji: "🍚" },
  { name: "Papa", proteinPer100g: 2, emoji: "🥔" },
  { name: "Fideos cocidos", proteinPer100g: 5, emoji: "🍝" },
  { name: "Pan", proteinPer100g: 8, emoji: "🍞" },
  { name: "Lentejas / legumbres cocidas", proteinPer100g: 9, emoji: "🫘" },
  { name: "Whey protein (scoop ~30g)", proteinPer100g: 80, emoji: "🥤" },
  { name: "Frutas (promedio)", proteinPer100g: 1, emoji: "🍎" },
];

// Comidas rápidas con proteína fija estimada (1 tap).
export const QUICK_MEALS: { food: string; protein: number; emoji: string }[] = [
  { food: "3 huevos", protein: 19, emoji: "🥚" },
  { food: "Pechuga 150g", protein: 46, emoji: "🍗" },
  { food: "Carne 200g", protein: 54, emoji: "🥩" },
  { food: "Atún 1 lata", protein: 30, emoji: "🐟" },
  { food: "Yogur proteico", protein: 20, emoji: "🥛" },
  { food: "Scoop whey", protein: 24, emoji: "🥤" },
  { food: "Queso magro 60g", protein: 14, emoji: "🧀" },
  { food: "Legumbres 1 plato", protein: 18, emoji: "🫘" },
];
