import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, RefreshControl, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useOrders } from "../../hooks/useOrders";
import OrderCard from "../../components/OrderCard";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { IconSymbol } from "../../components/ui/IconSymbol";
import { OrderStatus } from "../../types";

const OrderList = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Usar nuestro hook personalizado para órdenes
  const {
    orders,
    loading,
    error,
    deleteOrder,
    updateOrderStatus,
    refreshOrders
  } = useOrders();

  // Manejar la eliminación de una orden
  const handleDeleteOrder = async (id: number) => {
    try {
      const response = await deleteOrder(id);
      if (response.error) {
        Alert.alert("Error", response.error.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo eliminar la orden");
    }
  };

  // Manejar la actualización del estado de una orden
  const handleUpdateStatus = async (id: number, status: OrderStatus) => {
    try {
      const response = await updateOrderStatus(id, status);
      if (response.error) {
        Alert.alert("Error", response.error.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo actualizar el estado de la orden");
    }
  };

  // Manejar la acción de refrescar
  const onRefresh = async () => {
    setRefreshing(true);
    refreshOrders();
    setRefreshing(false);
  };

  // Navegar a la pantalla de agregar orden
  const navigateToAddOrder = () => {
    router.push("/orders/AddOrder");
  };

  // Filtrar órdenes según el estado seleccionado
  const getFilteredOrders = () => {
    if (!activeFilter) return orders;
    return orders.filter(order => order.status === activeFilter);
  };

  // Cambiar el filtro activo
  const toggleFilter = (filter: string | null) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  // Renderizar los filtros de estado
  const renderStatusFilters = () => {
    const filters = [
      { id: OrderStatus.PENDING, label: "Pendientes", color: "#f39c12" },
      { id: OrderStatus.IN_PROGRESS, label: "En Progreso", color: "#3498db" },
      { id: OrderStatus.COMPLETED, label: "Completadas", color: "#2ecc71" },
      { id: OrderStatus.CANCELLED, label: "Canceladas", color: "#e74c3c" }
    ];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              activeFilter === filter.id && { backgroundColor: filter.color }
            ]}
            onPress={() => toggleFilter(filter.id)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.id && styles.activeFilterText
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={tintColor} />
      </View>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Órdenes</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: tintColor }]}
          onPress={navigateToAddOrder}
        >
          <IconSymbol name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nueva Orden</Text>
        </TouchableOpacity>
      </View>

      {renderStatusFilters()}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { borderColor: tintColor }]}
            onPress={refreshOrders}
          >
            <Text style={[styles.retryButtonText, { color: tintColor }]}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onDelete={handleDeleteOrder}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeFilter
                ? `No hay órdenes con estado "${activeFilter}"`
                : "No hay órdenes disponibles"}
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: tintColor, marginTop: 16 }]}
              onPress={navigateToAddOrder}
            >
              <IconSymbol name="plus" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Crear Orden</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={filteredOrders.length === 0 ? { flex: 1, justifyContent: 'center' } : { paddingBottom: 20 }}
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
  filtersContainer: {
    flexDirection: "row",
    paddingBottom: 12,
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#f0f0f0",
  },
  filterText: {
    fontWeight: "500",
    color: "#666",
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "600",
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
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default OrderList;
