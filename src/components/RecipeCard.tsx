import { Link } from "react-router-dom";
import type { Recipe } from "../data/useRecipes";
import type { CSSProperties } from "react";
import "./RecipeCard.css";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const bgStyle: CSSProperties =
    recipe.serving_for === "female"
      ? {
          background:
            "linear-gradient(135deg, rgba(255,228,238,0.65) 0%, rgba(255,255,255,0.9) 100%)",
        }
      : {
          background:
            "linear-gradient(135deg, rgba(224,242,255,0.65) 0%, rgba(255,255,255,0.9) 100%)",
        };

  return (
    <Link to={`/recipe/${recipe.id}`} className="text-blue-600 w-full">
      <div
        className="rounded-lg shadow p-4 w-full flex flex-col items-center hover:drop-shadow-md transition-transform transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-amber-200"
        style={bgStyle}
        tabIndex={0}
      >
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-40 md:h-44 object-cover rounded mb-4"
        />
        <h2 className="text-lg font-semibold mb-1 text-center">{recipe.title}</h2>
        <p className="text-sm text-slate-600 mb-2 text-center line-clamp-3">
          {recipe.instructions.length > 120
            ? recipe.instructions.slice(0, 118).trim() + "…"
            : recipe.instructions}
        </p>
      </div>
    </Link>
  );
}
