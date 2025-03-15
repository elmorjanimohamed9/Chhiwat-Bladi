import { useState, useEffect, useCallback } from 'react';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
}

interface UseFetchRecipesResult {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  loadRecipes: (category: string, area: string) => Promise<void>;
  searchRecipes: (query: string) => Promise<void>;
}

export const useFetchRecipes = (
  initialCategory: string = 'All',
  initialArea: string = 'All'
): UseFetchRecipesResult => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecipes = useCallback(async (category: string, area: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      let url = '';

      // Determine which API endpoint to use based on filters
      if (category === 'All' && area === 'All') {
        // Get a selection of meals (using first letter 'a')
        url = 'https://www.themealdb.com/api/json/v1/1/search.php?f=a';
      } else if (category !== 'All' && area === 'All') {
        // Filter by category only
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
      } else if (category === 'All' && area !== 'All') {
        // Filter by area only
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
      } else {
        // Start with category filter (will handle both filters below)
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Handle case for both category and area filters (requires additional API calls)
      if (category !== 'All' && area !== 'All' && data.meals) {
        const detailedRecipes = [];

        // For each recipe, fetch full details to check area match
        for (const meal of data.meals) {
          const mealResponse = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
          );
          const mealData = await mealResponse.json();

          if (mealData.meals?.[0] && mealData.meals[0].strArea === area) {
            detailedRecipes.push(mealData.meals[0]);
          }
        }

        setRecipes(detailedRecipes);
      } else {
        setRecipes(data.meals || []);
      }
    } catch (err) {
      setError('Failed to load recipes. Please try again.');
      console.error('Error loading recipes:', err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchRecipes = useCallback(async (query: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (err) {
      setError('Failed to search recipes. Please try again.');
      console.error('Error searching recipes:', err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial recipes on mount
  useEffect(() => {
    loadRecipes(initialCategory, initialArea);
  }, [initialCategory, initialArea, loadRecipes]);

  return {
    recipes,
    loading,
    error,
    loadRecipes,
    searchRecipes,
  };
};
