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
    <main className="max-w-7xl mx-auto page-container py-8">
      <section className="bg-gradient-to-r from-brand-50 to-white dark:from-brand-800/40 dark:to-neutral-dark rounded-2xl p-5 md:p-8 mb-10 shadow-soft">
        <div className="flex flex-col md:flex-row items-center md:items-center md:justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-[clamp(1.4rem,6vw,2.8rem)] md:text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-neutral-darkest dark:text-white mb-2 logo-font">
              BrightPlanner
            </h1>
            <p className="text-base md:text-lg text-neutral-dark dark:text-neutral-light">
              Find sunde og lækre opskrifter.
            </p>
          </div>

          <div className="w-full md:w-1/2 mx-auto md:mx-0">
            <label className="relative block">
              <span className="sr-only">Søg opskrifter</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="placeholder:text-neutral text-sm md:text-base block bg-white dark:bg-neutral-dark w-full border border-neutral-light dark:border-neutral rounded-md py-2 px-3 md:py-3 md:px-4 pr-10 shadow-soft focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-200"
                placeholder="Søg efter opskrifter..."
                type="text"
              />
            </label>
          </div>
        </div>

    <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
          <button
            onClick={() => setCategory(null)}
      className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors shadow-soft ${
              category === null
        ? "bg-accent text-white"
        : "bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light hover:bg-neutral-lightest dark:hover:bg-neutral"
            }`}
          >
            Alle
          </button>
          {categoryOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setCategory(opt)}
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors shadow-soft ${
                category === opt
          ? "bg-accent text-white"
          : "bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light hover:bg-neutral-lightest dark:hover:bg-neutral"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-darkest dark:text-white">
            Måltidsinspiration
          </h2>
          <p className="text-neutral-dark dark:text-neutral-light">
            Ikke sikker på, hvad du skal spise? Prøv et tilfældigt forslag!
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => pickRandomFor("Morgenmad")}
            className="px-5 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-transform transform hover:scale-105 shadow-elevate"
          >
            Morgenmad
          </button>
          <button
            onClick={() => pickRandomFor("Frokost")}
            className="px-5 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-transform transform hover:scale-105 shadow-elevate"
          >
            Frokost
          </button>
          <button
            onClick={() => pickRandomFor("Aftensmad")}
            className="px-5 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-transform transform hover:scale-105 shadow-elevate"
          >
            Aftensmad
          </button>
          <button
            onClick={() => pickRandomFor("Dessert")}
            className="px-5 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-transform transform hover:scale-105 shadow-elevate"
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
              className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 md:p-8 mx-auto"
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
              <p className="text-xl text-neutral-dark dark:text-neutral-light mb-4">
                Ingen opskrifter fundet for "{query}".
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setCategory(null);
                }}
                className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark shadow-elevate"
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
