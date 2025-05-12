import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Order, OrderStatus } from "../types";
import { Colors } from "../constants/Colors";
import { useColorScheme } from "../hooks/useColorScheme";

interface OrderCardProps {
  order: Order;
  onDelete: (id: number) => Promise<void>;
  onUpdateStatus: (id: number, status: OrderStatus) => Promise<void>;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onDelete, onUpdateStatus }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const handleEdit = () => {
    router.push(`/orders/EditOrder?id=${order.id}`);
  };

  const handleDetails = () => {
    router.push(`/orders/OrderDetails?id=${order.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar la orden #${order.id}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await onDelete(order.id);
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la orden");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleStatusChange = () => {
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
        return; // No se puede cambiar el estado si ya está completada o cancelada
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
              await onUpdateStatus(order.id, option.value);
            } catch (error) {
              Alert.alert("Error", "No se pudo actualizar el estado de la orden");
            }
          }
        }))
      ]
    );
  };

  // Formatear el precio como moneda
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(order.totalPrice);

  // Formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener color según el estado
  const getStatusColor = () => {
    switch (order.status) {
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

  // Obtener texto según el estado
  const getStatusText = () => {
    switch (order.status) {
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

  return (
    <TouchableOpacity style={styles.card} onPress={handleDetails} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Orden #{order.id}</Text>
          <Text style={styles.price}>{formattedPrice}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Vehículo:</Text>
          <Text style={styles.value}>
            {order.vehicle ? `${order.vehicle.brand} ${order.vehicle.model}` : `ID: ${order.vehicleId}`}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Servicio:</Text>
          <Text style={styles.value}>
            {order.service ? order.service.name : `ID: ${order.serviceId}`}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>{formatDate(order.startDate)}</Text>
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {(order.status === OrderStatus.PENDING || order.status === OrderStatus.IN_PROGRESS) && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#3498db" }]}
              onPress={handleStatusChange}
            >
              <Text style={styles.buttonText}>Cambiar Estado</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: tintColor }]}
            onPress={handleEdit}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ecc71",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: "#666",
    width: 80,
  },
  value: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  statusContainer: {
    marginVertical: 10,
    flexDirection: "row",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default OrderCard;