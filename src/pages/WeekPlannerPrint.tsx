import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecipes } from "../data/useRecipes";
import type { Recipe } from "../data/useRecipes";

const STORAGE_KEY = "brightplanner.weekplan.v1";

export default function WeekPlannerPrint() {
  const { recipes, loading } = useRecipes();
  type Slot = { id: number | null };
  type Day = { breakfast: Slot; lunch: Slot; dinner: Slot };
  const [week, setWeek] = useState<Record<string, Day> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setWeek(JSON.parse(raw));
    } catch {
      setWeek(null);
    }
    // trigger print after a short delay to let the page render
    const t = setTimeout(() => {
      window.print();
    }, 300);
    return () => clearTimeout(t);
  }, []);

  if (!week)
    return (
      <main className="page-container py-8 max-w-7xl mx-auto">
        <p className="text-neutral-dark dark:text-neutral-light">Ingen ugeplan fundet.</p>
        <div className="mt-4">
          <Link to="/week-planner" className="text-brand-700 dark:text-brand-300 hover:underline">
            Tilbage
          </Link>
        </div>
      </main>
    );

  const DAYS = Object.keys(week);

  function titleFor(id: number | null) {
    if (id == null) return "—";
    const r: Recipe | undefined = recipes?.find((x: Recipe) => x.id === id);
    if (r) return r.title;
    if (loading) return "…";
    return "(ukendt)";
  }

  return (
    <main className="page-container py-8 max-w-7xl mx-auto text-neutral-dark dark:text-neutral-light">
      <h1 className="text-xl font-bold mb-4">Ugeplan</h1>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border p-2 text-left">Dag</th>
            <th className="border p-2 text-left">Morgenmad</th>
            <th className="border p-2 text-left">Frokost</th>
            <th className="border p-2 text-left">Aftensmad</th>
          </tr>
        </thead>
        <tbody>
          {DAYS.map((d) => (
            <tr key={d}>
              <td className="border p-2 align-top capitalize">{d}</td>
              <td className="border p-2">{titleFor(week[d].breakfast.id)}</td>
              <td className="border p-2">{titleFor(week[d].lunch.id)}</td>
              <td className="border p-2">{titleFor(week[d].dinner.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
