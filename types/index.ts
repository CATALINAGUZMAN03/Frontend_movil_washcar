// Interfaces para Vehículos
export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  plate: string;
  clientId: number; // ID del cliente al que pertenece el vehículo
  createdAt?: string;
  updatedAt?: string;
}

// Interfaces para Servicios
export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number; // Duración en minutos
  createdAt?: string;
  updatedAt?: string;
}

// Interfaces para Órdenes de Servicio
export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Order {
  id: number;
  vehicleId: number;
  serviceId: number;
  status: OrderStatus;
  startDate: string;
  endDate?: string;
  totalPrice: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Propiedades para relaciones (cuando se obtienen con join)
  vehicle?: Vehicle;
  service?: Service;
}

// Interfaces para Clientes (referencia)
export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interfaces para respuestas de API
export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export interface ApiError {
  message: string;
}
