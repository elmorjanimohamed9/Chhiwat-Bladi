import { useState, useEffect } from 'react';
import { Category } from '../types';

export const useFetchCategories = () => {
  const [categories, setCategories] = useState<(Category | { strCategory: string })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
      const data = await response.json();
      setCategories([{ strCategory: 'All' }, ...data.categories]);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refreshCategories: fetchCategories };
};
