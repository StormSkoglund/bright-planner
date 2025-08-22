import { useEffect, useState } from "react";

export type ServingFor = "mand" | "kvinde";

export interface Recipe {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string;
  image: string;
  serving_for?: ServingFor;
  category?: string;
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("/recipes.da.json");
        if (!res.ok) throw new Error("Failed to fetch recipes");
        const data = await res.json();
        if (!cancelled) setRecipes(data);
      } catch (e: unknown) {
        if (!cancelled) {
          let msg: string;
          if (typeof e === "object" && e !== null) {
            const maybe = e as { message?: unknown };
            msg = typeof maybe.message === "string" ? maybe.message : String(e);
          } else {
            msg = String(e);
          }
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { recipes, loading, error };
}
