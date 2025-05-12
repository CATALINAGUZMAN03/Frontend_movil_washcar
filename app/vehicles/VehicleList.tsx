import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, RefreshControl, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useVehicles } from "../../hooks/useVehicles";
import VehicleCard from "../../components/VehicleCard";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { IconSymbol } from "../../components/ui/IconSymbol";

const VehicleList = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;
  const [refreshing, setRefreshing] = useState(false);

  // Usar nuestro hook personalizado para vehículos
  const { vehicles, loading, error, deleteVehicle, refreshVehicles } = useVehicles();

  // Manejar la eliminación de un vehículo
  const handleDeleteVehicle = async (id: number) => {
    try {
      const response = await deleteVehicle(id);
      if (response.error) {
        Alert.alert("Error", response.error.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo eliminar el vehículo");
    }
  };

  // Manejar la acción de refrescar
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshVehicles();
    setRefreshing(false);
  };

  // Navegar a la pantalla de agregar vehículo
  const navigateToAddVehicle = () => {
    router.push("/vehicles/AddVehicle");
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={tintColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vehículos</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: tintColor }]}
          onPress={navigateToAddVehicle}
        >
          <IconSymbol name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nuevo Vehículo</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { borderColor: tintColor }]}
            onPress={refreshVehicles}
          >
            <Text style={[styles.retryButtonText, { color: tintColor }]}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            onDelete={handleDeleteVehicle}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay vehículos disponibles</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: tintColor, marginTop: 16 }]}
              onPress={navigateToAddVehicle}
            >
              <IconSymbol name="plus" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Agregar Vehículo</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={vehicles.length === 0 ? { flex: 1, justifyContent: 'center' } : {}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[tintColor]}
            tintColor={tintColor}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 40, // Para dar espacio al status bar
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 4,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
    marginBottom: 8,
  },
  retryButton: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default VehicleList;
