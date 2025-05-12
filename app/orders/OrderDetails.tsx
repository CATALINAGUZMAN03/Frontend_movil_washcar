import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useOrders } from "../../hooks/useOrders";
import { useVehicles } from "../../hooks/useVehicles";
import { useServices } from "../../hooks/useServices";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { IconSymbol } from "../../components/ui/IconSymbol";
import { Order, OrderStatus, Vehicle, Service } from "../../types";

const OrderDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = typeof params.id === 'string' ? parseInt(params.id) : 0;

  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const { getOrder, deleteOrder, updateOrderStatus } = useOrders();
  const { getVehicle } = useVehicles();
  const { getService } = useServices();

  const [order, setOrder] = useState<Order | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar los datos de la orden
  useEffect(() => {
    const loadOrder = async () => {
      if (orderId) {
        try {
          const response = await getOrder(orderId);
          if (response.data) {
            setOrder(response.data);

            // Cargar datos del vehículo
            if (response.data.vehicleId) {
              const vehicleResponse = await getVehicle(response.data.vehicleId);
              if (vehicleResponse.data) {
                setVehicle(vehicleResponse.data);
              }
            }

            // Cargar datos del servicio
            if (response.data.serviceId) {
              const serviceResponse = await getService(response.data.serviceId);
              if (serviceResponse.data) {
                setService(serviceResponse.data);
              }
            }
          } else if (response.error) {
            setError(response.error.message);
          }
        } catch (error: any) {
          setError(error.message || "No se pudo cargar la orden");
        } finally {
          setLoading(false);
        }
      } else {
        setError("ID de orden no válido");
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  // Manejar la edición de la orden
  const handleEdit = () => {
    router.push(`/orders/EditOrder?id=${orderId}`);
  };

  // Manejar la eliminación de la orden
  const handleDelete = () => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar la orden #${orderId}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              const response = await deleteOrder(orderId);
              if (response.error) {
                Alert.alert("Error", response.error.message);
              } else {
                Alert.alert(
                  "Éxito",
                  "Orden eliminada correctamente",
                  [
                    {
                      text: "OK",
                      onPress: () => router.back(),
                    },
                  ]
                );
              }
            } catch (error: any) {
              Alert.alert("Error", error.message || "No se pudo eliminar la orden");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // Manejar el cambio de estado de la orden
  const handleStatusChange = () => {
    if (!order) return;

    // Opciones de estado según el estado actual
    let options = [];

    switch (order.status) {
      case OrderStatus.PENDING:
        options = [
          { label: "En Progreso", value: OrderStatus.IN_PROGRESS },
          { label: "Completada", value: OrderStatus.COMPLETED },
          { label: "Cancelada", value: OrderStatus.CANCELLED }
        ];
        break;
      case OrderStatus.IN_PROGRESS:
        options = [
          { label: "Completada", value: OrderStatus.COMPLETED },
          { label: "Cancelada", value: OrderStatus.CANCELLED }
        ];
        break;
      default:
        Alert.alert("Información", "No se puede cambiar el estado de una orden completada o cancelada");
        return;
    }

    Alert.alert(
      "Cambiar Estado",
      "Selecciona el nuevo estado para esta orden:",
      [
        { text: "Cancelar", style: "cancel" },
        ...options.map(option => ({
          text: option.label,
          onPress: async () => {
            try {
              const response = await updateOrderStatus(orderId, option.value);
              if (response.error) {
                Alert.alert("Error", response.error.message);
              } else {
                // Actualizar el estado local
                setOrder(prev => prev ? { ...prev, status: option.value } : null);
                Alert.alert("Éxito", "Estado actualizado correctamente");
              }
            } catch (error: any) {
              Alert.alert("Error", error.message || "No se pudo actualizar el estado");
            }
          }
        }))
      ]
    );
  };

  // Formatear el precio como moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Formatear la fecha para mostrar
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={tintColor} />
        <Text style={styles.loadingText}>Cargando datos de la orden...</Text>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Error: {error || "No se encontró la orden"}</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: tintColor }]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Detalles de la Orden</Text>
      </View>

      <View style={styles.orderHeader}>
        <View style={styles.orderNumberContainer}>
          <Text style={styles.orderNumber}>Orden #{order.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
          </View>
        </View>

        <Text style={styles.orderDate}>
          Fecha: {order.startDate ? formatDate(order.startDate) : "No disponible"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Detalles del Vehículo</Text>

        {vehicle ? (
          <View style={styles.detailsContainer}>
            <Text style={styles.vehicleName}>{vehicle.brand} {vehicle.model}</Text>
            <Text style={styles.vehicleDetails}>Año: {vehicle.year}</Text>
            <Text style={styles.vehicleDetails}>Placa: {vehicle.plate}</Text>
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => router.push(`/vehicles/VehicleDetails?id=${vehicle.id}`)}
            >
              <Text style={[styles.viewMoreText, { color: tintColor }]}>Ver detalles del vehículo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.notAvailableText}>
            Vehículo ID: {order.vehicleId} (Información no disponible)
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Detalles del Servicio</Text>

        {service ? (
          <View style={styles.detailsContainer}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <View style={styles.serviceDetails}>
              <Text style={styles.serviceDetail}>Duración: {service.duration} minutos</Text>
              <Text style={styles.servicePrice}>{formatCurrency(service.price)}</Text>
            </View>
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => router.push(`/services/ServiceDetails?id=${service.id}`)}
            >
              <Text style={[styles.viewMoreText, { color: tintColor }]}>Ver detalles del servicio</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.notAvailableText}>
            Servicio ID: {order.serviceId} (Información no disponible)
          </Text>
        )}
      </View>

      {order.notes && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notas</Text>
          <Text style={styles.notes}>{order.notes}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resumen de Pago</Text>
        <View style={styles.paymentSummary}>
          <Text style={styles.paymentLabel}>Precio del servicio:</Text>
          <Text style={styles.paymentValue}>{formatCurrency(order.totalPrice || 0)}</Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{formatCurrency(order.totalPrice || 0)}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {(order.status === OrderStatus.PENDING || order.status === OrderStatus.IN_PROGRESS) && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#3498db" }]}
            onPress={handleStatusChange}
          >
            <IconSymbol name="arrow.right.circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Cambiar Estado</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: tintColor }]}
          onPress={handleEdit}
        >
          <IconSymbol name="pencil" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#e74c3c" }]}
          onPress={handleDelete}
        >
          <IconSymbol name="trash" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Función para obtener el color según el estado
const getStatusColor = (status: string) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "#f39c12"; // Amarillo
    case OrderStatus.IN_PROGRESS:
      return "#3498db"; // Azul
    case OrderStatus.COMPLETED:
      return "#2ecc71"; // Verde
    case OrderStatus.CANCELLED:
      return "#e74c3c"; // Rojo
    default:
      return "#95a5a6"; // Gris
  }
};

// Función para obtener el texto según el estado
const getStatusText = (status: string) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "Pendiente";
    case OrderStatus.IN_PROGRESS:
      return "En Progreso";
    case OrderStatus.COMPLETED:
      return "Completada";
    case OrderStatus.CANCELLED:
      return "Cancelada";
    default:
      return "Desconocido";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    marginBottom: 20,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  orderHeader: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  orderNumberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 22,
    fontWeight: "bold",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
    marginTop: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  detailsContainer: {
    marginBottom: 8,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceDetail: {
    fontSize: 14,
    color: "#666",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2ecc71",
  },
  viewMoreButton: {
    marginTop: 8,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
  notAvailableText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  notes: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  paymentSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#666",
  },
  paymentValue: {
    fontSize: 14,
    color: "#333",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ecc71",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default OrderDetails;
