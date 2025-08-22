import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useRecipes } from "../data/useRecipes";
import RecipeCard from "../components/RecipeCard";
import { Link } from "react-router-dom";

export default function Home() {
  const { recipes, loading, error } = useRecipes();
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<string | null>(
    searchParams.get("category") || null
  );

  // suggestion state and helper must be declared before any early return
  const [suggestions, setSuggestions] = useState<{
    male?: (typeof recipes)[number];
    female?: (typeof recipes)[number];
    category?: string;
  } | null>(null);

  

  function pickRandomFor(categoryKey: string) {
    const males = recipes.filter(
      (r) => r.category === categoryKey && r.serving_for === "male"
    );
    const females = recipes.filter(
      (r) => r.category === categoryKey && r.serving_for === "female"
    );

    const pick = <T,>(arr: T[]) => (arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined);

    const male = pick(males);
    const female = pick(females);

    setSuggestions({ male, female, category: categoryKey });
  }

  useEffect(() => {
    if (category) setSearchParams({ category });
    else setSearchParams({});
  }, [category, setSearchParams]);

  if (loading) return <p className="text-gray-500">Indlæser opskrifter...</p>;
  if (error) return <p className="text-red-500">Fejl: {error}</p>;

  const filtered = recipes
    .filter((r) => r.title.toLowerCase().includes(query.trim().toLowerCase()))
    .filter((r) => (category ? r.category === category : true));
  

  return (
    <main className="max-w-7xl mx-auto p-6">
      <section className="bg-gradient-to-r from-green-100 to-white rounded-lg p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-center md:justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
              BrightPlanner Opskrifter
            </h1>
            <p className="text-gray-600">
              Find opskrifter, inspireret af Bright Line Eating dieten.
            </p>
          </div>

          <div className="w-full md:w-1/2 mx-auto md:mx-0">
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

  <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
          <button
            onClick={() => setCategory(null)}
            className={`px-3 py-1 text-sm rounded-full hover:shadow-md ${
              category === null
                ? "bg-amber-200 text-amber-800"
                : "bg-blue-300 text-teal"
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setCategory("Morgenmad")}
            className={`px-3 py-1 text-sm rounded-full hover:shadow-md ${
              category === "Morgenmad"
                ? "bg-amber-200 text-amber-800"
                : "bg-blue-300 text-teal"
            }`}
          >
            Morgenmad
          </button>
          <button
            onClick={() => setCategory("Frokost")}
            className={`px-3 py-1 text-sm rounded-full hover:shadow-md ${
              category === "Frokost"
                ? "bg-amber-200 text-amber-800"
                : "bg-blue-300 text-teal"
            }`}
          >
            Frokost
          </button>
          <button
            onClick={() => setCategory("Aftensmad")}
            className={`px-3 py-1 text-sm rounded-full hover:shadow-md ${
              category === "Aftensmad"
                ? "bg-amber-200 text-amber-800"
                : "bg-blue-300 text-teal"
            }`}
          >
            Aftensmad
          </button>
          <button
            onClick={() => setCategory("Dessert")}
            className={`px-3 py-1 text-sm rounded-full hover:shadow-md ${
              category === "Dessert"
                ? "bg-amber-200 text-amber-800"
                : "bg-blue-300 text-teal"
            }`}
          >
            Dessert
          </button>
        </div>

        {/* Meal picker buttons */}
        <div className="mt-6 flex flex-col md:flex-row gap-3 items-center justify-center">
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={() => pickRandomFor("Morgenmad")}
              className="px-4 py-2 rounded-md bg-amber-200 text-amber-800 hover:shadow"
            >
              Hvad skal jeg spise til morgenmad
            </button>
            <button
              onClick={() => pickRandomFor("Frokost")}
              className="px-4 py-2 rounded-md bg-amber-200 text-amber-800 hover:shadow"
            >
              Hvad skal jeg spise til frokost?
            </button>
            <button
              onClick={() => pickRandomFor("Aftensmad")}
              className="px-4 py-2 rounded-md bg-amber-200 text-amber-800 hover:shadow"
            >
              Hvad skal jeg spise til Aftensmad?
            </button>
            <button
              onClick={() => pickRandomFor("Dessert")}
              className="px-4 py-2 rounded-md bg-amber-200 text-amber-800 hover:shadow"
            >
              Hvad skal jeg spise til dessert?
            </button>
          </div>

          {/* suggestions display */}
          {suggestions && (
            <div className="mt-4 md:mt-0 md:ml-6 bg-white p-3 rounded shadow">
              <div className="text-sm text-slate-600">Forslag ({suggestions.category})</div>
              <div className="flex gap-3 mt-2">
                {suggestions.male ? (
                  <Link to={`/recipe/${suggestions.male.id}`} className="px-3 py-2 bg-blue-50 rounded w-44 text-center">
                    Mand: {suggestions.male.title}
                  </Link>
                ) : (
                  <div className="px-3 py-2 bg-gray-100 rounded w-44 text-center">Mand: ingen</div>
                )}

                {suggestions.female ? (
                  <Link to={`/recipe/${suggestions.female.id}`} className="px-3 py-2 bg-pink-50 rounded w-44 text-center">
                    Kvinde: {suggestions.female.title}
                  </Link>
                ) : (
                  <div className="px-3 py-2 bg-gray-100 rounded w-44 text-center">Kvinde: ingen</div>
                )}
              </div>
              <div className="mt-2 text-right">
                <button onClick={() => setSuggestions(null)} className="text-xs text-slate-500 underline">Fjern forslag</button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-10 text-center md:text-left">
          Opskrifter
        </h2>

        {filtered.length === 0 ? (
          <div className="rounded-md p-6 bg-white border border-slate-100 shadow-sm text-center">
            <p className="text-gray-600">
              Ingen opskrifter fundet for "{query}".
            </p>
            <div className="mt-4">
              <button
                onClick={() => {
                  setQuery("");
                  setCategory(null);
                }}
                className="px-4 py-2 bg-amber-200 text-amber-800 rounded-md hover:shadow"
              >
                Nulstil søgning og filtre
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
