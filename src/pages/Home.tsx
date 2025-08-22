import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useRecipes } from "../data/useRecipes";
import type { Recipe } from "../data/useRecipes";
import pickRandomByCategory from "../utils/pickRandom";
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
    mand?: Recipe;
    kvinde?: Recipe;
    category?: string;
  } | null>(null);

  const categoryOptions = ["Morgenmad", "Frokost", "Aftensmad", "Dessert"];

  function pickRandomFor(categoryKey: string) {
    const { mand, kvinde } = pickRandomByCategory(recipes, categoryKey);
    setSuggestions({ mand, kvinde, category: categoryKey });
  }

  useEffect(() => {
    if (category) setSearchParams({ category });
    else setSearchParams({});
  }, [category, setSearchParams]);

  const filtered = useMemo(
    () =>
      recipes
        .filter((r) =>
          r.title.toLowerCase().includes(query.trim().toLowerCase())
        )
        .filter((r) => (category ? r.category === category : true)),
    [recipes, query, category]
  );

  if (loading) return <p className="text-gray-500">Indlæser opskrifter...</p>;
  if (error) return <p className="text-red-500">Fejl: {error}</p>;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <section className="bg-gradient-to-r from-brand-light to-white rounded-2xl p-8 mb-10 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-center md:justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-[clamp(1.25rem,6vw,2.5rem)] md:text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-neutral-darkest mb-2 logo-font">
              BrightPlanner
            </h1>
            <p className="text-lg text-neutral-dark">
              Find sunde og lækre opskrifter.
            </p>
          </div>

          <div className="w-full md:w-1/2 mx-auto md:mx-0">
            <label className="relative block">
              <span className="sr-only">Søg opskrifter</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="placeholder:text-neutral block bg-white w-full border border-neutral-light rounded-md py-3 px-4 pr-10 shadow-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent-light"
                placeholder="Søg efter opskrifter..."
                type="text"
              />
            </label>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
          <button
            onClick={() => setCategory(null)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
              category === null
                ? "bg-accent text-white shadow-md"
                : "bg-white text-neutral-dark hover:bg-neutral-lightest"
            }`}
          >
            Alle
          </button>
          {categoryOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setCategory(opt)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                category === opt
                  ? "bg-accent text-white shadow-md"
                  : "bg-white text-neutral-dark hover:bg-neutral-lightest"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-darkest">
            Måltidsinspiration
          </h2>
          <p className="text-neutral-dark">
            Ikke sikker på, hvad du skal spise? Prøv et tilfældigt forslag!
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => pickRandomFor("Morgenmad")}
            className="px-5 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition-transform transform hover:scale-105 shadow-lg"
          >
            Morgenmad
          </button>
          <button
            onClick={() => pickRandomFor("Frokost")}
            className="px-5 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition-transform transform hover:scale-105 shadow-lg"
          >
            Frokost
          </button>
          <button
            onClick={() => pickRandomFor("Aftensmad")}
            className="px-5 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition-transform transform hover:scale-105 shadow-lg"
          >
            Aftensmad
          </button>
          <button
            onClick={() => pickRandomFor("Dessert")}
            className="px-5 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition-transform transform hover:scale-105 shadow-lg"
          >
            Dessert
          </button>
        </div>
      </section>

      <section className="mt-12">
        {suggestions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-neutral-darkest/40">
            <div
              className="absolute inset-0"
              onClick={() => setSuggestions(null)}
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="suggestion-title"
              className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full p-8 mx-auto"
            >
              <h3
                id="suggestion-title"
                className="text-2xl font-bold text-center mb-6"
              >
                Forslag til {suggestions.category}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-brand-light rounded-lg p-4 flex flex-col items-center text-center">
                  {suggestions.mand ? (
                    <Link
                      to={`/recipe/${suggestions.mand.id}`}
                      className="flex flex-col items-center gap-4 w-full"
                    >
                      <img
                        src={suggestions.mand.image}
                        alt=""
                        className="w-full h-40 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-brand-dark">
                          Mand
                        </div>
                        <div className="text-base text-neutral-darkest">
                          {suggestions.mand.title}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="h-full flex items-center justify-center text-neutral-dark">
                      Mand: ingen opskrift
                    </div>
                  )}
                </div>

                <div className="bg-accent-light rounded-lg p-4 flex flex-col items-center text-center">
                  {suggestions.kvinde ? (
                    <Link
                      to={`/recipe/${suggestions.kvinde.id}`}
                      className="flex flex-col items-center gap-4 w-full"
                    >
                      <img
                        src={suggestions.kvinde.image}
                        alt=""
                        className="w-full h-40 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-accent-dark">
                          Kvinde
                        </div>
                        <div className="text-base text-neutral-darkest">
                          {suggestions.kvinde.title}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="h-full flex items-center justify-center text-neutral-dark">
                      Kvinde: ingen opskrift
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setSuggestions(null)}
                  className="px-6 py-2 rounded-full bg-neutral-light hover:bg-neutral text-neutral-darkest font-semibold"
                >
                  Luk
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-neutral-dark mb-4">
                Ingen opskrifter fundet for "{query}".
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setCategory(null);
                }}
                className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark shadow-md"
              >
                Nulstil søgning
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
