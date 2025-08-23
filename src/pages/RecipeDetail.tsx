import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useRecipes } from "../data/useRecipes";

export default function RecipeDetail() {
  const { id } = useParams();
  const { recipes, loading, error } = useRecipes();
  const recipe = recipes.find((r) => r.id === Number(id));
  const [copied, setCopied] = useState(false);

  async function copyIngredients() {
    if (!recipe) return;
    const text = `Ingredienser til ${recipe.title}:\n` +
      recipe.ingredients.map((i) => `- ${i}`).join("\n");

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        // keep off-screen
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy ingredients", e);
    }
  }

  if (loading) return <p className="text-gray-500">Indlæser opskrift...</p>;
  if (error) return <p className="text-red-500">Fejl: {error}</p>;
  if (!recipe) return <p className="text-red-500">Opskrift ikke fundet.</p>;

  return (
    <main className="max-w-4xl mx-auto page-container py-8">
      <div className="mb-6">
        <Link to="/" className="text-brand-dark hover:underline font-semibold">
          ← Tilbage til alle opskrifter
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="p-4 md:p-8 md:w-1/2">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="p-8 md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              {recipe.category && (
                <span className="text-sm font-semibold bg-accent-light text-accent-dark px-3 py-1 rounded-full">
                  {recipe.category}
                </span>
              )}
              {recipe.serving_for && (
                <span className="text-sm font-semibold bg-brand-light text-brand-dark px-3 py-1 rounded-full">
                  Til: {recipe.serving_for}
                </span>
              )}
            </div>
            <h2 className="text-[clamp(1.25rem,6vw,2rem)] md:text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-neutral-darkest break-words">
              {recipe.title}
            </h2>
          </div>
        </div>

          <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <div className="flex items-start justify-between flex-wrap">
                  <h3 className="text-[clamp(1rem,3.5vw,1.125rem)] md:text-[clamp(1.125rem,2.5vw,1.25rem)] font-bold mb-4 text-neutral-darkest">
                    Ingredienser
                  </h3>
                  <div className="ml-0 sm:ml-4 mt-2 sm:mt-0">
                    <button
                      type="button"
                      onClick={copyIngredients}
                      className="inline-flex items-center gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                      aria-label={`Kopiér ingredienser for ${recipe.title}`}
                    >
                      {copied ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="hidden sm:inline">Kopieret</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-dark" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                            <path d="M8 2a2 2 0 00-2 2v1H5a2 2 0 00-2 2v7a2 2 0 002 2h7a2 2 0 002-2v-1h1a2 2 0 002-2V8a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H8zM7 5a1 1 0 011-1h4a1 1 0 011 1v1H7V5z" />
                          </svg>
                          <span className="hidden sm:inline">Kopier ingredienser</span>
                        </>
                      )}
                    </button>
                    <p className="sr-only" role="status" aria-live="polite">
                      {copied ? "Ingredienser kopieret til udklipsholderen" : ""}
                    </p>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-2 text-neutral-dark">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
            </div>
            <div>
              <h3 className="text-[clamp(1rem,3.5vw,1.125rem)] md:text-[clamp(1.125rem,2.5vw,1.25rem)] font-bold mb-4 text-neutral-darkest">
                Fremgangsmåde
              </h3>
              <p className="whitespace-pre-line leading-relaxed text-neutral-dark">
                {recipe.instructions}
              </p>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
