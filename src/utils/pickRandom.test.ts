import { describe, it, expect } from "vitest";
import pickRandomByCategory from "./pickRandom";
import type { Recipe } from "../data/useRecipes";

const mockRecipes: Recipe[] = [
  { id: 1, title: "A", ingredients: [], instructions: "", image: "", serving_for: "mand", category: "Aftensmad" },
  { id: 2, title: "B", ingredients: [], instructions: "", image: "", serving_for: "kvinde", category: "Aftensmad" },
  { id: 3, title: "C", ingredients: [], instructions: "", image: "", serving_for: "mand", category: "Morgenmad" },
];

describe("pickRandomByCategory", () => {
  it("returns a mand and kvinde when both exist in category", () => {
    const res = pickRandomByCategory(mockRecipes, "Aftensmad");
    expect(res.mand).toBeDefined();
    expect(res.kvinde).toBeDefined();
  });

  it("returns undefined when no items for a type", () => {
    const res = pickRandomByCategory(mockRecipes, "Morgenmad");
    expect(res.mand).toBeDefined();
    expect(res.kvinde).toBeUndefined();
  });
});
