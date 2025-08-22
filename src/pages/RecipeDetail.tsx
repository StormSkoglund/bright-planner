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
    <main className="p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Link to="/" className="text-blue-600 hover:underline">
          ← Tilbage
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow p-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{recipe.title}</h2>
            <div className="mt-2 flex items-center gap-2">
              {recipe.category && (
                <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  {recipe.category}
                </span>
              )}
              {recipe.serving_for && (
                <span className="text-sm bg-slate-100 text-slate-800 px-2 py-1 rounded-full">
                  Til: {recipe.serving_for}
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="mt-4">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-60 md:h-80 object-cover rounded mb-4"
          />

          <h3 className="text-lg font-semibold mt-4 mb-2">Ingredienser</h3>
          <ul className="list-disc list-inside mb-4">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mb-2">Fremgangsmåde</h3>
          <p className="whitespace-pre-line leading-relaxed">
            {recipe.instructions}
          </p>
        </div>
      </article>
    </main>
  );
}
