import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useVehicles } from "../../hooks/useVehicles";
import { useOrders } from "../../hooks/useOrders";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { IconSymbol } from "../../components/ui/IconSymbol";
import { Vehicle, Order } from "../../types";

const VehicleDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const vehicleId = typeof params.id === 'string' ? parseInt(params.id) : 0;

  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const { getVehicle, deleteVehicle } = useVehicles();
  const { orders } = useOrders();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [vehicleOrders, setVehicleOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar los datos del vehículo
  useEffect(() => {
    const loadVehicle = async () => {
      if (vehicleId) {
        try {
          const response = await getVehicle(vehicleId);
          if (response.data) {
            setVehicle(response.data);
          } else if (response.error) {
            setError(response.error.message);
          }
        } catch (error: any) {
          setError(error.message || "No se pudo cargar el vehículo");
        } finally {
          setLoading(false);
        }
      } else {
        setError("ID de vehículo no válido");
        setLoading(false);
      }
    };

    loadVehicle();
  }, [vehicleId]);

  // Filtrar órdenes relacionadas con este vehículo
  useEffect(() => {
    if (orders && orders.length > 0 && vehicleId) {
      const filteredOrders = orders.filter(order => order.vehicleId === vehicleId);
      setVehicleOrders(filteredOrders);
    }
  }, [orders, vehicleId]);

  // Manejar la edición del vehículo
  const handleEdit = () => {
    router.push(`/vehicles/EditVehicle?id=${vehicleId}`);
  };

  // Manejar la eliminación del vehículo
  const handleDelete = () => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar el vehículo ${vehicle?.brand} ${vehicle?.model}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              const response = await deleteVehicle(vehicleId);
              if (response.error) {
                Alert.alert("Error", response.error.message);
              } else {
                Alert.alert(
                  "Éxito",
                  "Vehículo eliminado correctamente",
                  [
                    {
                      text: "OK",
                      onPress: () => router.back(),
                    },
                  ]
                );
              }
            } catch (error: any) {
              Alert.alert("Error", error.message || "No se pudo eliminar el vehículo");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // Manejar la creación de una nueva orden para este vehículo
  const handleCreateOrder = () => {
    router.push(`/orders/AddOrder?vehicleId=${vehicleId}`);
  };

  // Manejar la visualización de una orden
  const handleViewOrder = (orderId: number) => {
    router.push(`/orders/OrderDetails?id=${orderId}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={tintColor} />
        <Text style={styles.loadingText}>Cargando datos del vehículo...</Text>
      </View>
    );
  }

  if (error || !vehicle) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Error: {error || "No se encontró el vehículo"}</Text>
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
        <Text style={styles.title}>Detalles del Vehículo</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.vehicleName}>{vehicle.brand} {vehicle.model}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Año:</Text>
          <Text style={styles.value}>{vehicle.year}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Placa:</Text>
          <Text style={styles.value}>{vehicle.plate}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Cliente ID:</Text>
          <Text style={styles.value}>{vehicle.clientId}</Text>
        </View>

        {vehicle.createdAt && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Registrado:</Text>
            <Text style={styles.value}>{new Date(vehicle.createdAt).toLocaleDateString()}</Text>
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

        {vehicleOrders.length === 0 ? (
          <View style={styles.emptyOrders}>
            <Text style={styles.emptyText}>No hay órdenes de servicio para este vehículo</Text>
          </View>
        ) : (
          vehicleOrders.map(order => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderItem}
              onPress={() => handleViewOrder(order.id)}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>Orden #{order.id}</Text>
                <Text style={styles.orderPrice}>
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0
                  }).format(order.totalPrice)}
                </Text>
              </View>

              <View style={styles.orderInfo}>
                <Text style={styles.orderInfoText}>
                  Servicio: {order.service?.name || `ID: ${order.serviceId}`}
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
  vehicleName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
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

export default VehicleDetails;
