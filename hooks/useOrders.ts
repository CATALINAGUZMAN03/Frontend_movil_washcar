import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { Order, ApiResponse, OrderStatus } from "../types";

export const useOrders = () => {
  const api = useApi<Order>("/orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Función para forzar una actualización de los datos
  const refreshOrders = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Cargar todas las órdenes
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.getAll();
        if (response.error) {
          setError(response.error.message);
        } else if (response.data) {
          setOrders(response.data);
        }
      } catch (err: any) {
        setError(err.message || "Error al cargar las órdenes");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [refreshTrigger]); // Se ejecuta cuando cambia refreshTrigger

  // Obtener una orden por ID
  const getOrder = async (id: number): Promise<ApiResponse<Order>> => {
    return await api.get(id);
  };

  // Crear una nueva orden
  const createOrder = async (orderData: Partial<Order>): Promise<ApiResponse<Order>> => {
    // Asegurarse de que la orden tenga un estado por defecto si no se proporciona
    const orderWithDefaults = {
      status: OrderStatus.PENDING,
      ...orderData
    };
    
    const response = await api.post(orderWithDefaults);
    if (response.data && !response.error) {
      refreshOrders(); // Actualizar la lista después de crear
    }
    return response;
  };

  // Actualizar una orden existente
  const updateOrder = async (id: number, orderData: Partial<Order>): Promise<ApiResponse<Order>> => {
    const response = await api.put(id, orderData);
    if (response.data && !response.error) {
      refreshOrders(); // Actualizar la lista después de modificar
    }
    return response;
  };

  // Eliminar una orden
  const deleteOrder = async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(id);
    if (!response.error) {
      refreshOrders(); // Actualizar la lista después de eliminar
    }
    return response;
  };

  // Actualizar el estado de una orden
  const updateOrderStatus = async (id: number, status: OrderStatus): Promise<ApiResponse<Order>> => {
    return await updateOrder(id, { status });
  };

  // Filtrar órdenes por estado
  const filterOrdersByStatus = (status: OrderStatus): Order[] => {
    return orders.filter(order => order.status === status);
  };

  return {
    orders,
    loading,
    error,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    filterOrdersByStatus,
    refreshOrders
  };
};
