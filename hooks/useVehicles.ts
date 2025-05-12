import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { Vehicle, ApiResponse } from "../types";

export const useVehicles = () => {
  const api = useApi<Vehicle>("/vehicles");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Función para forzar una actualización de los datos
  const refreshVehicles = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Cargar todos los vehículos
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.getAll();
        if (response.error) {
          setError(response.error.message);
        } else if (response.data) {
          setVehicles(response.data);
        }
      } catch (err: any) {
        setError(err.message || "Error al cargar los vehículos");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [refreshTrigger]); // Se ejecuta cuando cambia refreshTrigger

  // Obtener un vehículo por ID
  const getVehicle = async (id: number): Promise<ApiResponse<Vehicle>> => {
    return await api.get(id);
  };

  // Crear un nuevo vehículo
  const createVehicle = async (vehicleData: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> => {
    const response = await api.post(vehicleData);
    if (response.data && !response.error) {
      refreshVehicles(); // Actualizar la lista después de crear
    }
    return response;
  };

  // Actualizar un vehículo existente
  const updateVehicle = async (id: number, vehicleData: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> => {
    const response = await api.put(id, vehicleData);
    if (response.data && !response.error) {
      refreshVehicles(); // Actualizar la lista después de modificar
    }
    return response;
  };

  // Eliminar un vehículo
  const deleteVehicle = async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(id);
    if (!response.error) {
      refreshVehicles(); // Actualizar la lista después de eliminar
    }
    return response;
  };

  return {
    vehicles,
    loading,
    error,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    refreshVehicles
  };
};
