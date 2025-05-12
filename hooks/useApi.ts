import { useState } from "react";
import { ApiError, ApiResponse } from "../types";

interface ApiMethods<T> {
  get: (id?: number) => Promise<ApiResponse<T>>;
  getAll: () => Promise<ApiResponse<T[]>>;
  post: (data: Partial<T>) => Promise<ApiResponse<T>>;
  put: (id: number, data: Partial<T>) => Promise<ApiResponse<T>>;
  delete: (id: number) => Promise<ApiResponse<void>>;
}

// URL base para la API
const BASE_URL = "http://localhost:3000"; // Cambia esto según tu configuración

export const useApi = <T>(endpoint: string): ApiMethods<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Función para manejar errores
  const handleError = (err: any): ApiError => {
    console.error("API Error:", err);
    return { message: err.message || "Ocurrió un error en la solicitud" };
  };

  // GET - Obtener un recurso por ID
  const get = async (id?: number): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const url = id ? `${BASE_URL}${endpoint}/${id}` : `${BASE_URL}${endpoint}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data, loading: false, error: null };
    } catch (err: any) {
      const apiError = handleError(err);
      setError(apiError);
      return { data: null, loading: false, error: apiError };
    } finally {
      setLoading(false);
    }
  };

  // GET ALL - Obtener todos los recursos
  const getAll = async (): Promise<ApiResponse<T[]>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data, loading: false, error: null };
    } catch (err: any) {
      const apiError = handleError(err);
      setError(apiError);
      return { data: null, loading: false, error: apiError };
    } finally {
      setLoading(false);
    }
  };

  // POST - Crear un nuevo recurso
  const post = async (data: Partial<T>): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      return { data: responseData, loading: false, error: null };
    } catch (err: any) {
      const apiError = handleError(err);
      setError(apiError);
      return { data: null, loading: false, error: apiError };
    } finally {
      setLoading(false);
    }
  };

  // PUT - Actualizar un recurso existente
  const put = async (id: number, data: Partial<T>): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      return { data: responseData, loading: false, error: null };
    } catch (err: any) {
      const apiError = handleError(err);
      setError(apiError);
      return { data: null, loading: false, error: apiError };
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Eliminar un recurso
  const delete_ = async (id: number): Promise<ApiResponse<void>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return { data: null, loading: false, error: null };
    } catch (err: any) {
      const apiError = handleError(err);
      setError(apiError);
      return { data: null, loading: false, error: apiError };
    } finally {
      setLoading(false);
    }
  };

  return {
    get,
    getAll,
    post,
    put,
    delete: delete_
  };
};
