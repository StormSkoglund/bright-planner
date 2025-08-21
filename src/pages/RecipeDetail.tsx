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
    <main className="p-6 max-w-xl mx-auto">
      <Link to="/" className="text-blue-600 hover:underline">
        ← Tilbage
      </Link>
      <h2 className="text-2xl font-bold mt-2 mb-4">{recipe.title}</h2>
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full max-w-md rounded mb-4"
      />
      <h3 className="text-lg font-semibold mt-4 mb-2">Ingredienser</h3>
      <ul className="list-disc list-inside mb-4">
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>
      <h3 className="text-lg font-semibold mb-2">Fremgangsmåde</h3>
      <p>{recipe.instructions}</p>
    </main>
  );
}
