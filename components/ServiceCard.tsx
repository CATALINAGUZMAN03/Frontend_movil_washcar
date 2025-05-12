import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Service } from "../types";
import { Colors } from "../constants/Colors";
import { useColorScheme } from "../hooks/useColorScheme";

interface ServiceCardProps {
  service: Service;
  onDelete: (id: number) => Promise<void>;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onDelete }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const handleEdit = () => {
    router.push(`/services/EditService?id=${service.id}`);
  };

  const handleDetails = () => {
    router.push(`/services/ServiceDetails?id=${service.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar el servicio "${service.name}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await onDelete(service.id);
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el servicio");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // Formatear el precio como moneda
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(service.price);

  return (
    <TouchableOpacity style={styles.card} onPress={handleDetails} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{service.name}</Text>
          <Text style={styles.price}>{formattedPrice}</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>

        <Text style={styles.duration}>Duración: {service.duration} minutos</Text>

        <View style={styles.buttonContainer}>
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
    marginBottom: 8,
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
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  duration: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
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

export default ServiceCard;