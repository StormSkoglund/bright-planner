import { useEffect, useMemo, useState } from "react";
import { useRecipes, type Recipe } from "../data/useRecipes";
import { copyToClipboard } from "../utils/copyToClipboard";

const STORAGE_KEY = "brightplanner.weekplan.v1";

function stripAmount(ing: string) {
  if (!ing) return "";
  let s = ing;
  // remove parenthetical amounts first
  s = s.replace(/\([^)]*\)/g, "");
  // remove leading numeric quantities like '10', '0.5', '1/2', or unicode fractions
  s = s.replace(/^\s*(?:\d+[\d/.]*)|^[\s]*[¼½¾⅓⅔]/, "");
  // remove a following unit token if present (e.g. 'oz', 'g', 'ml') when separated by space
  s = s.replace(
    /^\s*(?:grams?|gr|g|kg|oz|ounce(?:s)?|ml|l|tbsp|tablespoons?|tbsp|tsp|teaspoons?|spsk|tsk|stk)\b\.?\s*/i,
    ""
  );
  // remove common adjectives at the start (Danish + English) using word boundaries
  s = s.replace(
    /^\s*(?:large|small|medium|fresh|chopped|diced|minced|sliced|peeled|grated|finely|coarsely|shredded|fint|fintsnittet|fint\s+hakket|hakket|skåret|skiver|skiverne)\b\s*/i,
    ""
  );
  // collapse whitespace and trailing punctuation
  s = s.replace(/\s+/g, " ").trim();
  s = s.replace(/[.,;:\s]+$/, "");
  return s;
}

export default function ShoppingList() {
  const { recipes, loading } = useRecipes();
  const [weekPlan, setWeekPlan] = useState<Record<
    string,
    Record<string, { id: number | null }>
  > | null>(null);
  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    function read() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setWeekPlan(JSON.parse(raw));
        else setWeekPlan(null);
      } catch {
        setWeekPlan(null);
      }
    }

    read();

    const onStorage = (ev: StorageEvent) => {
      if (ev.key === STORAGE_KEY) read();
    };

    const onCustom = () => read();

    window.addEventListener("storage", onStorage);
    window.addEventListener("weekplan:changed", onCustom as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("weekplan:changed", onCustom as EventListener);
    };
  }, [loading, refreshKey]);

  // debounce recompute if refresh is triggered rapidly
  const [debounceTick, setDebounceTick] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setDebounceTick((v) => v + 1), 120);
    return () => clearTimeout(id);
  }, [refreshKey]);

  const items = useMemo(() => {
    // depend on debounceTick so quick successive refreshes only compute once
    void debounceTick;
    if (!weekPlan || !recipes) return [] as string[];
    const ids = new Set<number>();
    for (const dayKey of Object.keys(weekPlan)) {
      const day = weekPlan[dayKey];
      for (const mealKey of Object.keys(day)) {
        const slot = day[mealKey];
        if (slot && slot.id) ids.add(slot.id as number);
      }
    }

    const set = new Set<string>();
    for (const id of Array.from(ids)) {
      const r = recipes.find((x: Recipe) => x.id === id);
      if (!r || !r.ingredients) continue;
      for (const ing of r.ingredients) {
        const name = stripAmount(String(ing)).toLowerCase();
        if (!name) continue;
        set.add(name);
      }
    }

    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [weekPlan, recipes, debounceTick]);

  if (!weekPlan) return null;

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  async function copyAll() {
    const text = items.map((i) => `- ${i}`).join("\n");
    try {
      const ok = await copyToClipboard(text);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } else {
        console.error("Copy failed");
      }
    } catch (e) {
      console.error("Copy failed", e);
    }
  }

  function downloadCSV() {
    const csv = items.map((i) => `"${i.replace(/"/g, '""')}",1`).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "indkøbsliste.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function printList() {
    const w = window.open("", "_blank", "noopener");
    if (!w) return;
    w.document.write(
      `<html><head><title>Indkøbsliste</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:20px}ul{font-size:16px}</style></head><body><h1>Indkøbsliste</h1><ul>${items
        .map((i) => `<li>${i}</li>`)
        .join("")}</ul></body></html>`
    );
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <section className="mt-8 bg-white rounded-lg p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Indkøbsliste</h2>
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <button
            onClick={refresh}
            className="px-3 py-1 bg-neutral-light rounded"
          >
            Opdater
          </button>
          <button
            onClick={copyAll}
            className="px-3 py-1 bg-neutral-light rounded"
          >
            {copied ? "Kopieret" : "Kopiér"}
          </button>
          <button
            onClick={downloadCSV}
            className="px-3 py-1 bg-neutral-light rounded"
          >
            CSV
          </button>
          <button
            onClick={printList}
            className="px-3 py-1 bg-neutral-light rounded"
          >
            Print
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-neutral mt-3">Ingen ingredienser valgt endnu.</p>
      ) : (
        <ul className="mt-3 sm:grid sm:grid-cols-2 sm:gap-x-6 shopping-list">
          {items.map((it) => (
            <li key={it} className="text-sm capitalize break-words py-1">
              {it}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
