import type { Recipe } from "../data/useRecipes";

export default function pickRandomByCategory(
  recipes: Recipe[],
  category: string
): { mand?: Recipe; kvinde?: Recipe } {
  const pick = <T,>(arr: T[]) => (arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined);

  const mands = recipes.filter((r) => r.category === category && r.serving_for === "mand");
  const kvindes = recipes.filter((r) => r.category === category && r.serving_for === "kvinde");

  return { mand: pick(mands), kvinde: pick(kvindes) };
}
