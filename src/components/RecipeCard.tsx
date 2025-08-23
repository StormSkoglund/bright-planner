import { Link } from "react-router-dom";
import { useState } from "react";
import type { Recipe } from "../data/useRecipes";
import "./RecipeCard.css";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [copied, setCopied] = useState(false);
  const genderBgClass =
    recipe.serving_for === "kvinde"
      ? "bg-accent-light/50"
      : "bg-brand-light/50";

  async function copyIngredients(e: React.MouseEvent) {
    // prevent card link navigation when clicking copy
    e.preventDefault();
    e.stopPropagation();
    const text =
      `Ingredienser til ${recipe.title}:\n` +
      recipe.ingredients.map((i) => `- ${i}`).join("\n");
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  }

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
          <button
            onClick={copyIngredients}
            title={copied ? "Kopieret" : "Kopier ingredienser"}
            className="absolute top-2 right-2 md:top-3 md:right-3 z-10 inline-flex items-center justify-center h-8 w-8 md:h-9 md:w-9 rounded-full bg-white/80 hover:bg-white shadow-sm focus:outline-none"
            aria-label={`Kopier ingredienser for ${recipe.title}`}>
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-neutral-dark"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path d="M8 2a2 2 0 00-2 2v1H5a2 2 0 00-2 2v7a2 2 0 002 2h7a2 2 0 002-2v-1h1a2 2 0 002-2V8a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H8zM7 5a1 1 0 011-1h4a1 1 0 011 1v1H7V5z" />
              </svg>
            )}
          </button>
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
