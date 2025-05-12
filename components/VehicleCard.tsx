import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Vehicle } from "../types";
import { Colors } from "../constants/Colors";
import { useColorScheme } from "../hooks/useColorScheme";

interface VehicleCardProps {
  vehicle: Vehicle;
  onDelete: (id: number) => Promise<void>;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onDelete }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const handleEdit = () => {
    router.push(`/vehicles/EditVehicle?id=${vehicle.id}`);
  };

  const handleDetails = () => {
    router.push(`/vehicles/VehicleDetails?id=${vehicle.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar el vehículo ${vehicle.brand} ${vehicle.model}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await onDelete(vehicle.id);
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el vehículo");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleDetails} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {vehicle.brand} {vehicle.model}
          </Text>
          <Text style={styles.year}>{vehicle.year}</Text>
        </View>

        <Text style={styles.plate}>Placa: {vehicle.plate}</Text>

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
  year: {
    fontSize: 16,
    color: "#666",
  },
  plate: {
    fontSize: 16,
    marginBottom: 12,
    color: "#444",
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

export default VehicleCard;
