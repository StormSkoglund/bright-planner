import { Link } from "react-router-dom";
import type { Recipe } from "../data/useRecipes";
import "./RecipeCard.css";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 w-64 flex flex-col items-center">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-36 object-cover rounded mb-4"
      />
      <h2 className="text-lg font-semibold mb-2">{recipe.title}</h2>
      <Link
        to={`/recipe/${recipe.id}`}
        className="text-blue-600 hover:underline mt-2"
      >
        View Recipe
      </Link>
    </div>
  );
}
