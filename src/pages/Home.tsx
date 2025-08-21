import { useState } from "react";
import { useRecipes } from "../data/useRecipes";
import RecipeCard from "../components/RecipeCard";

export default function Home() {
  const { recipes, loading, error } = useRecipes();
  const [query, setQuery] = useState("");

  if (loading) return <p className="text-gray-500">Indlæser opskrifter...</p>;
  if (error) return <p className="text-red-500">Fejl: {error}</p>;

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto p-6">
      <section className="bg-gradient-to-r from-amber-50 to-white rounded-lg p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
              BrightPlanner Opskrifter
            </h1>
            <p className="text-gray-600">
              Find hurtige, sunde og lækre opskrifter til at planlægge din uge.
            </p>
          </div>

          <div className="w-full md:w-1/2">
            <label className="relative block">
              <span className="sr-only">Søg opskrifter</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-200 rounded-md py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                placeholder="Søg opskrifter efter navn..."
                type="text"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button className="px-3 py-1 text-sm rounded-full bg-amber-100 text-amber-800">
            Alle
          </button>
          <button className="px-3 py-1 text-sm rounded-full bg-amber-50 text-amber-700">
            Morgenmad
          </button>
          <button className="px-3 py-1 text-sm rounded-full bg-amber-50 text-amber-700">
            Frokost
          </button>
          <button className="px-3 py-1 text-sm rounded-full bg-amber-50 text-amber-700">
            Aftensmad
          </button>
          <button className="px-3 py-1 text-sm rounded-full bg-amber-50 text-amber-700">
            Dessert
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Opskrifter</h2>

        {filtered.length === 0 ? (
          <div className="rounded-md p-6 bg-white border border-slate-100 shadow-sm">
            <p className="text-gray-600">
              Ingen opskrifter fundet for "{query}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
