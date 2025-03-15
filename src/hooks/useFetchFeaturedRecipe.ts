import { useState, useEffect } from 'react';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
}

interface UseFetchFeaturedRecipeResult {
  featuredRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
  refreshFeaturedRecipe: () => Promise<void>;
}

export const useFetchFeaturedRecipe = (): UseFetchFeaturedRecipeResult => {
  const [featuredRecipe, setFeaturedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedRecipe = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Use the random meal endpoint to get a featured recipe
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.meals && data.meals.length > 0) {
        setFeaturedRecipe(data.meals[0]);
      } else {
        throw new Error('No featured recipe found');
      }
    } catch (err) {
      setError('Failed to fetch featured recipe.');
      console.error('Error fetching featured recipe:', err);
      setFeaturedRecipe(null);
    } finally {
      setLoading(false);
    }
  };

  // Load featured recipe on initial mount
  useEffect(() => {
    fetchFeaturedRecipe();
  }, []);

  return {
    featuredRecipe,
    loading,
    error,
    refreshFeaturedRecipe: fetchFeaturedRecipe,
  };
};
