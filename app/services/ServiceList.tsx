import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, RefreshControl, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useServices } from "../../hooks/useServices";
import ServiceCard from "../../components/ServiceCard";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { IconSymbol } from "../../components/ui/IconSymbol";

const ServiceList = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;
  const [refreshing, setRefreshing] = useState(false);

  // Usar nuestro hook personalizado para servicios
  const { services, loading, error, deleteService, refreshServices } = useServices();

  // Manejar la eliminación de un servicio
  const handleDeleteService = async (id: number) => {
    try {
      const response = await deleteService(id);
      if (response.error) {
        Alert.alert("Error", response.error.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo eliminar el servicio");
    }
  };

  // Manejar la acción de refrescar
  const onRefresh = async () => {
    setRefreshing(true);
    refreshServices();
    setRefreshing(false);
  };

  // Navegar a la pantalla de agregar servicio
  const navigateToAddService = () => {
    router.push("/services/AddService");
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
        <Text style={styles.title}>Servicios</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: tintColor }]}
          onPress={navigateToAddService}
        >
          <IconSymbol name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nuevo Servicio</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { borderColor: tintColor }]}
            onPress={refreshServices}
          >
            <Text style={[styles.retryButtonText, { color: tintColor }]}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ServiceCard
            service={item}
            onDelete={handleDeleteService}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay servicios disponibles</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: tintColor, marginTop: 16 }]}
              onPress={navigateToAddService}
            >
              <IconSymbol name="plus" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Agregar Servicio</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={services.length === 0 ? { flex: 1, justifyContent: 'center' } : {}}
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

export default ServiceList;
