import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { Service, ApiResponse } from "../types";

export const useServices = () => {
  const api = useApi<Service>("/services");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Función para forzar una actualización de los datos
  const refreshServices = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Cargar todos los servicios
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.getAll();
        if (response.error) {
          setError(response.error.message);
        } else if (response.data) {
          setServices(response.data);
        }
      } catch (err: any) {
        setError(err.message || "Error al cargar los servicios");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [refreshTrigger]); // Se ejecuta cuando cambia refreshTrigger

  // Obtener un servicio por ID
  const getService = async (id: number): Promise<ApiResponse<Service>> => {
    return await api.get(id);
  };

  // Crear un nuevo servicio
  const createService = async (serviceData: Partial<Service>): Promise<ApiResponse<Service>> => {
    const response = await api.post(serviceData);
    if (response.data && !response.error) {
      refreshServices(); // Actualizar la lista después de crear
    }
    return response;
  };

  // Actualizar un servicio existente
  const updateService = async (id: number, serviceData: Partial<Service>): Promise<ApiResponse<Service>> => {
    const response = await api.put(id, serviceData);
    if (response.data && !response.error) {
      refreshServices(); // Actualizar la lista después de modificar
    }
    return response;
  };

  // Eliminar un servicio
  const deleteService = async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(id);
    if (!response.error) {
      refreshServices(); // Actualizar la lista después de eliminar
    }
    return response;
  };

  return {
    services,
    loading,
    error,
    getService,
    createService,
    updateService,
    deleteService,
    refreshServices
  };
};
