import { useEffect, useState } from "react";

export interface Recipe {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string;
  image: string;
  serving_for?: string;
  category?: string;
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/recipes.da.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch recipes");
        return res.json();
      })
      .then(setRecipes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { recipes, loading, error };
}
