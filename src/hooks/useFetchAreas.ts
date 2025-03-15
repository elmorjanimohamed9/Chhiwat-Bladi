import { useState, useEffect } from 'react';

interface Area {
  strArea: string;
}

interface UseFetchAreasResult {
  areas: Area[];
  loading: boolean;
  error: string | null;
  refreshAreas: () => Promise<void>;
}

export const useFetchAreas = (): UseFetchAreasResult => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAreas = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.meals) {
        setAreas([{ strArea: 'All' }, ...data.meals]);
      } else {
        setAreas([{ strArea: 'All' }]);
      }
    } catch (err) {
      setError('Failed to fetch cuisine areas. Please try again.');
      console.error('Error fetching areas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load areas on initial mount
  useEffect(() => {
    fetchAreas();
  }, []);

  return { areas, loading, error, refreshAreas: fetchAreas };
};
