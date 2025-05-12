import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useServices } from "../../hooks/useServices";
import { useOrders } from "../../hooks/useOrders";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { IconSymbol } from "../../components/ui/IconSymbol";
import { Service, Order } from "../../types";

const ServiceDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const serviceId = typeof params.id === 'string' ? parseInt(params.id) : 0;

  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const { getService, deleteService } = useServices();
  const { orders } = useOrders();

  const [service, setService] = useState<Service | null>(null);
  const [serviceOrders, setServiceOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar los datos del servicio
  useEffect(() => {
    const loadService = async () => {
      if (serviceId) {
        try {
          const response = await getService(serviceId);
          if (response.data) {
            setService(response.data);
          } else if (response.error) {
            setError(response.error.message);
          }
        } catch (error: any) {
          setError(error.message || "No se pudo cargar el servicio");
        } finally {
          setLoading(false);
        }
      } else {
        setError("ID de servicio no válido");
        setLoading(false);
      }
    };

    loadService();
  }, [serviceId]);

  // Filtrar órdenes relacionadas con este servicio
  useEffect(() => {
    if (orders && orders.length > 0 && serviceId) {
      const filteredOrders = orders.filter(order => order.serviceId === serviceId);
      setServiceOrders(filteredOrders);
    }
  }, [orders, serviceId]);

  // Manejar la edición del servicio
  const handleEdit = () => {
    router.push(`/services/EditService?id=${serviceId}`);
  };

  // Manejar la eliminación del servicio
  const handleDelete = () => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar el servicio "${service?.name}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              const response = await deleteService(serviceId);
              if (response.error) {
                Alert.alert("Error", response.error.message);
              } else {
                Alert.alert(
                  "Éxito",
                  "Servicio eliminado correctamente",
                  [
                    {
                      text: "OK",
                      onPress: () => router.back(),
                    },
                  ]
                );
              }
            } catch (error: any) {
              Alert.alert("Error", error.message || "No se pudo eliminar el servicio");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // Manejar la creación de una nueva orden para este servicio
  const handleCreateOrder = () => {
    router.push(`/orders/AddOrder?serviceId=${serviceId}`);
  };

  // Manejar la visualización de una orden
  const handleViewOrder = (orderId: number) => {
    router.push(`/orders/OrderDetails?id=${orderId}`);
  };

  // Formatear el precio como moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={tintColor} />
        <Text style={styles.loadingText}>Cargando datos del servicio...</Text>
      </View>
    );
  }

  if (error || !service) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Error: {error || "No se encontró el servicio"}</Text>
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
        <Text style={styles.title}>Detalles del Servicio</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.serviceName}>{service.name}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Precio:</Text>
          <Text style={styles.price}>{formatCurrency(service.price)}</Text>
        </View>

        <View style={styles.durationContainer}>
          <Text style={styles.durationLabel}>Duración:</Text>
          <Text style={styles.duration}>{service.duration} minutos</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Descripción:</Text>
          <Text style={styles.description}>{service.description}</Text>
        </View>

        {service.createdAt && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Registrado:</Text>
            <Text style={styles.value}>{new Date(service.createdAt).toLocaleDateString()}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: tintColor }]}
            onPress={handleEdit}
          >
            <IconSymbol name="pencil" size={16} color="#fff" />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <IconSymbol name="trash" size={16} color="#fff" />
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.ordersSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Órdenes de Servicio</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: tintColor }]}
            onPress={handleCreateOrder}
          >
            <IconSymbol name="plus" size={16} color="#fff" />
            <Text style={styles.buttonText}>Nueva Orden</Text>
          </TouchableOpacity>
        </View>

        {serviceOrders.length === 0 ? (
          <View style={styles.emptyOrders}>
            <Text style={styles.emptyText}>No hay órdenes para este servicio</Text>
          </View>
        ) : (
          serviceOrders.map(order => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderItem}
              onPress={() => handleViewOrder(order.id)}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>Orden #{order.id}</Text>
                <Text style={styles.orderPrice}>
                  {formatCurrency(order.totalPrice)}
                </Text>
              </View>

              <View style={styles.orderInfo}>
                <Text style={styles.orderInfoText}>
                  Vehículo: {order.vehicle ? `${order.vehicle.brand} ${order.vehicle.model}` : `ID: ${order.vehicleId}`}
                </Text>
                <Text style={styles.orderInfoText}>
                  Fecha: {new Date(order.startDate).toLocaleDateString()}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

// Función para obtener el color según el estado
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return "#f39c12"; // Amarillo
    case 'in_progress':
      return "#3498db"; // Azul
    case 'completed':
      return "#2ecc71"; // Verde
    case 'cancelled':
      return "#e74c3c"; // Rojo
    default:
      return "#95a5a6"; // Gris
  }
};

// Función para obtener el texto según el estado
const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return "Pendiente";
    case 'in_progress':
      return "En Progreso";
    case 'completed':
      return "Completada";
    case 'cancelled':
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: "#666",
    width: 80,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ecc71",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  durationLabel: {
    fontSize: 16,
    color: "#666",
    width: 80,
  },
  duration: {
    fontSize: 16,
    color: "#333",
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#666",
    width: 100,
  },
  value: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
  },
  ordersSection: {
    margin: 16,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyOrders: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
  orderItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2ecc71",
  },
  orderInfo: {
    marginTop: 4,
  },
  orderInfoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ServiceDetails;
