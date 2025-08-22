import { Link } from "react-router-dom";
import type { Recipe } from "../data/useRecipes";
import "./RecipeCard.css";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const genderBgClass =
    recipe.serving_for === "kvinde"
      ? "bg-accent-light/50"
      : "bg-brand-light/50";

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group w-full block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
      tabIndex={0}
    >
      <div className="flex flex-col h-full">
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div
            className={`absolute inset-0 ${genderBgClass} mix-blend-multiply`}
          ></div>
        </div>
        <div className="p-5 flex flex-col flex-grow bg-white">
          <h2 className="text-lg font-bold text-neutral-darkest mb-2 flex-grow">
            {recipe.title}
          </h2>
          <p className="text-sm text-neutral-dark line-clamp-3">
            {recipe.instructions}
          </p>
        </div>
      </div>
    </Link>
  );
}
