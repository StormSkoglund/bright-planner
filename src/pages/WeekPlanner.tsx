import { useEffect, useState } from "react";
import { useRecipes } from "../data/useRecipes";
import type { Recipe } from "../data/useRecipes";
import ShoppingList from "../components/ShoppingList";

type MealKey = "breakfast" | "lunch" | "dinner";
type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

const DAYS: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const MEALS: MealKey[] = ["breakfast", "lunch", "dinner"];

type Slot = { id: number | null; locked?: boolean };
type DayPlan = { [K in MealKey]: Slot };
type WeekPlan = { [D in DayKey]: DayPlan };

const STORAGE_KEY = "brightplanner.weekplan.v1";

function emptyWeek(): WeekPlan {
  const w: Partial<WeekPlan> = {};
  for (const d of DAYS) {
    w[d] = {
      breakfast: { id: null, locked: false },
      lunch: { id: null, locked: false },
      dinner: { id: null, locked: false },
    } as DayPlan;
  }
  return w as WeekPlan;
}

function pickRandom(recipes: Recipe[]) {
  if (!recipes || recipes.length === 0) return null;
  const i = Math.floor(Math.random() * recipes.length);
  return recipes[i];
}

type Classified = Recipe & { allowedMeals: MealKey[]; tags?: string[] };

function classify(recipes: Recipe[]): Classified[] {
  return recipes.map((r) => {
    const title = (r.title || "").toLowerCase();
    const image = (r.image || "").toLowerCase();
    const category = (r.category || "").toLowerCase();

    const tags: string[] = [];

    // Detect grains/oat-based recipes (simple heuristics)
    const grainKeywords = [
      "oat",
      "havre",
      "grød",
      "porridge",
      "oatmeal",
      "chiaporridge",
    ];
    if (grainKeywords.some((k) => title.includes(k) || image.includes(k)))
      tags.push("grain");

    // Map category to allowed meals (Danish categories)
    const allowedMeals: MealKey[] = [];
    if (
      category.includes("morgen") ||
      category.includes("morgenmad") ||
      title.includes("morgen")
    ) {
      allowedMeals.push("breakfast");
    }
    if (
      category.includes("frokost") ||
      category.includes("lunch") ||
      title.includes("frokost")
    ) {
      allowedMeals.push("lunch");
    }
    if (
      category.includes("aften") ||
      category.includes("aftensmad") ||
      title.includes("aften")
    ) {
      allowedMeals.push("dinner");
    }

    // If category didn't map, fall back to reasonable defaults: treat salads/plates as lunch/dinner
    if (allowedMeals.length === 0) {
      const lunchKeywords = [
        "salat",
        "wrap",
        "bowl",
        "fisk",
        "kylling",
        "tuna",
        "tun",
        "rejer",
        "shrimp",
        "laks",
        "salmon",
        "pork",
        "svin",
        "bøf",
        "steg",
      ];
      if (lunchKeywords.some((k) => title.includes(k) || image.includes(k)))
        allowedMeals.push("lunch");
      const dinnerKeywords = [
        "stege",
        "ovn",
        "bagt",
        "grillet",
        "pan",
        "wok",
        "stew",
        "gryde",
        "bøf",
        "kød",
      ];
      if (dinnerKeywords.some((k) => title.includes(k) || image.includes(k)))
        allowedMeals.push("dinner");
    }

    // As a last resort, allow all meals
    if (allowedMeals.length === 0)
      allowedMeals.push("breakfast", "lunch", "dinner");

    return { ...r, allowedMeals, tags };
  });
}

export default function WeekPlanner() {
  const { recipes, loading } = useRecipes();
  const [week, setWeek] = useState<WeekPlan>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as WeekPlan;
    } catch {
      // ignore
    }
    return emptyWeek();
  });

  useEffect(() => {
    // save automatically whenever week changes
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(week));
      // notify other windows/components
      try {
        window.dispatchEvent(new CustomEvent("weekplan:changed"));
      } catch {
        // ignore if CustomEvent not supported
      }
    } catch {
      // ignore
    }
  }, [week]);

  function generateNewWeek() {
    if (!recipes || recipes.length === 0) return;
    const classified = classify(recipes);
    setWeek((prev) => {
      const next = { ...prev } as WeekPlan;
      for (const d of DAYS) {
        for (const m of MEALS) {
          const slot = prev[d][m];
          if (slot.locked) continue;
          // filter by allowed meals
          let pool = classified.filter((c) => c.allowedMeals.includes(m));
          // if not breakfast, exclude grain-tagged recipes
          if (m !== "breakfast")
            pool = pool.filter((c) => !(c.tags || []).includes("grain"));
          if (pool.length === 0) pool = classified; // fallback
          const pick = pickRandom(pool) as Classified | null;
          next[d] = {
            ...next[d],
            [m]: { id: pick ? pick.id : null, locked: false },
          } as DayPlan;
        }
      }
      return next;
    });
  }

  function toggleLock(day: DayKey, meal: MealKey) {
    setWeek((prev) => {
      const next = { ...prev } as WeekPlan;
      const slot = { ...next[day][meal] };
      slot.locked = !slot.locked;
      next[day] = { ...next[day], [meal]: slot } as DayPlan;
      return next;
    });
  }

  function clearWeek() {
    setWeek(emptyWeek());
  }

  function getRecipeById(id: number | null) {
    if (id == null) return null;
    return recipes.find((r) => r.id === id) || null;
  }

  return (
    <main className="max-w-7xl mx-auto page-container py-8">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-neutral-darkest dark:text-white">Ugeplan</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={generateNewWeek}
            className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold shadow-soft text-sm"
          >
            Generer ugeplan
          </button>
          <button
            onClick={() => window.open("/week-planner/print", "_blank")}
            className="px-3 py-2 rounded-lg font-semibold text-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-dark text-neutral-dark hover:bg-neutral-light dark:text-neutral-light dark:hover:bg-neutral-800 shadow-soft"
          >
            Print
          </button>
          <button
            onClick={clearWeek}
            className="px-2 py-2 rounded-lg text-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-dark text-neutral-dark hover:bg-neutral-light dark:text-neutral-light dark:hover:bg-neutral-800 shadow-soft"
          >
            Ryd
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-neutral-muted dark:text-neutral-light">Indlæser opskrifter…</p>
      ) : (
        <>
          <div className="hidden lg:block mb-2 text-sm font-semibold text-neutral-dark dark:text-neutral-light">
            Dag / Måltid
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DAYS.map((day) => (
              <div key={day} className="bg-white dark:bg-neutral-dark rounded-2xl p-5 shadow-soft">
                <div className="font-semibold capitalize mb-4 text-neutral-darkest dark:text-white">{day}</div>
                <div className="space-y-2">
                  {MEALS.map((meal) => {
                    const slot = week[day as DayKey][meal as MealKey];
                    const recipe = getRecipeById(slot.id);
                    return (
                      <div key={meal} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 hover:bg-neutral-light dark:hover:bg-neutral-800 transition-colors">
                        <div>
                          <div className="text-sm font-medium capitalize text-neutral-darkest dark:text-white">
                            {meal}
                          </div>
                          <div className="text-sm text-neutral-dark dark:text-neutral-light">
                            {recipe ? (
                              recipe.title
                            ) : (
                              <span className="text-neutral-muted">—</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              toggleLock(day as DayKey, meal as MealKey)
                            }
                            className={`px-2 py-1 rounded-lg border text-sm shadow-soft ${
                              slot.locked
                                ? "bg-accent-500 text-white border-accent-500 hover:bg-accent-600"
                                : "bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light border-neutral-200 dark:border-neutral-700 hover:bg-neutral-light dark:hover:bg-neutral-800"
                            }`}
                            title={slot.locked ? "Lås" : "Lås op"}
                            aria-label={slot.locked ? "Lås" : "Lås op"}
                          >
                            {slot.locked ? "🔒" : "🔓"}
                          </button>
                          <button
                            onClick={() => {
                              // quick replace this slot with a random recipe (respect classification)
                              if (!recipes || recipes.length === 0) return;
                              const classified = classify(recipes);
                              let pool = classified.filter((c) =>
                                c.allowedMeals.includes(meal as MealKey)
                              );
                              if (meal !== "breakfast")
                                pool = pool.filter(
                                  (c) => !(c.tags || []).includes("grain")
                                );
                              if (pool.length === 0) pool = classified;
                              const r = pickRandom(pool) as Classified | null;
                              setWeek((prev) => {
                                const next = { ...prev } as WeekPlan;
                                next[day as DayKey] = {
                                  ...next[day as DayKey],
                                  [meal]: {
                                    id: r ? r.id : null,
                                    locked: false,
                                  },
                                } as DayPlan;
                                return next;
                              });
                            }}
                            className="px-2 py-1 rounded-lg border bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light border-neutral-200 dark:border-neutral-700 text-sm hover:bg-neutral-light dark:hover:bg-neutral-800 shadow-soft"
                            title="Erstat med tilfældig opskrift"
                            aria-label="Erstat med tilfældig opskrift"
                          >
                            🔀
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <ShoppingList />
    </main>
  );
}
