import { useEffect, useState } from "react";

interface FetchError {
  message: string;
}

export const useFetch = (endpoint: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000${endpoint}`); // Cambia la URL según tu configuración
        if (!response.ok) throw new Error("Error al obtener los datos.");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError({ message: (err as Error).message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};
