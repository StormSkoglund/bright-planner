import { useParams, Link } from "react-router-dom";
import { useRecipes } from "../data/useRecipes";

export default function RecipeDetail() {
  const { id } = useParams();
  const { recipes, loading, error } = useRecipes();
  const recipe = recipes.find((r) => r.id === Number(id));

  if (loading) return <p className="text-gray-500">Indlæser opskrift...</p>;
  if (error) return <p className="text-red-500">Fejl: {error}</p>;
  if (!recipe) return <p className="text-red-500">Opskrift ikke fundet.</p>;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link to="/" className="text-brand-dark hover:underline font-semibold">
          ← Tilbage til alle opskrifter
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
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

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-[clamp(1rem,3.5vw,1.125rem)] md:text-[clamp(1.125rem,2.5vw,1.25rem)] font-bold mb-4 text-neutral-darkest">
                Ingredienser
              </h3>
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
