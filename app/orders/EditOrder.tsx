import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useOrders } from "../../hooks/useOrders";
import { useVehicles } from "../../hooks/useVehicles";
import { useServices } from "../../hooks/useServices";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Order, OrderStatus, Vehicle, Service } from "../../types";

const EditOrder = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = typeof params.id === 'string' ? parseInt(params.id) : 0;

  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const { getOrder, updateOrder } = useOrders();
  const { vehicles, loading: loadingVehicles } = useVehicles();
  const { services, loading: loadingServices } = useServices();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Estado para los campos del formulario
  const [formData, setFormData] = useState<Partial<Order>>({
    vehicleId: 0,
    serviceId: 0,
    status: OrderStatus.PENDING,
    startDate: new Date().toISOString(),
    totalPrice: 0,
    notes: "",
  });

  // Estado para los errores de validación
  const [errors, setErrors] = useState({
    vehicleId: "",
    serviceId: "",
    status: "",
    notes: "",
  });

  // Cargar los datos de la orden al iniciar
  useEffect(() => {
    const loadOrder = async () => {
      if (orderId) {
        try {
          const response = await getOrder(orderId);
          if (response.data) {
            setFormData(response.data);
          } else if (response.error) {
            Alert.alert("Error", response.error.message);
            router.back();
          }
        } catch (error: any) {
          Alert.alert("Error", error.message || "No se pudo cargar la orden");
          router.back();
        } finally {
          setInitialLoading(false);
        }
      } else {
        Alert.alert("Error", "ID de orden no válido");
        router.back();
      }
    };

    loadOrder();
  }, [orderId]);

  // Actualizar el precio total cuando cambia el servicio seleccionado
  useEffect(() => {
    if (formData.serviceId) {
      const selectedService = services.find(service => service.id === formData.serviceId);
      if (selectedService) {
        setFormData(prev => ({
          ...prev,
          totalPrice: selectedService.price
        }));
      }
    }
  }, [formData.serviceId, services]);

  // Manejar cambios en los campos del formulario
  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Limpiar el error cuando el usuario comienza a escribir
    if (errors[field as keyof typeof errors]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  // Validar el formulario
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validar vehículo
    if (!formData.vehicleId) {
      newErrors.vehicleId = "Debe seleccionar un vehículo";
      isValid = false;
    }

    // Validar servicio
    if (!formData.serviceId) {
      newErrors.serviceId = "Debe seleccionar un servicio";
      isValid = false;
    }

    // Validar estado
    if (!formData.status) {
      newErrors.status = "El estado es requerido";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await updateOrder(orderId, formData);

      if (response.error) {
        Alert.alert("Error", response.error.message);
      } else {
        Alert.alert(
          "Éxito",
          "Orden actualizada correctamente",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo actualizar la orden");
    } finally {
      setLoading(false);
    }
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

  if (initialLoading || loadingVehicles || loadingServices) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={tintColor} />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Editar Orden de Servicio</Text>
      </View>

      <View style={styles.form}>
        {/* Información de la Orden */}
        <View style={styles.orderInfoContainer}>
          <Text style={styles.orderNumber}>Orden #{orderId}</Text>
          <Text style={styles.orderDate}>
            Fecha: {formData.startDate ? formatDate(formData.startDate) : "No disponible"}
          </Text>
        </View>

        {/* Selección de Vehículo */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Vehículo</Text>
          <View style={[styles.selectContainer, errors.vehicleId ? styles.inputError : null]}>
            <Text style={styles.selectText}>
              {vehicles.find(v => v.id === formData.vehicleId)
                ? `${vehicles.find(v => v.id === formData.vehicleId)?.brand} ${vehicles.find(v => v.id === formData.vehicleId)?.model} (${vehicles.find(v => v.id === formData.vehicleId)?.plate})`
                : "Seleccione un vehículo"}
            </Text>
          </View>
          {errors.vehicleId ? <Text style={styles.errorText}>{errors.vehicleId}</Text> : null}
        </View>

        {/* Selección de Servicio */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Servicio</Text>
          <View style={[styles.selectContainer, errors.serviceId ? styles.inputError : null]}>
            <Text style={styles.selectText}>
              {services.find(s => s.id === formData.serviceId)
                ? `${services.find(s => s.id === formData.serviceId)?.name}`
                : "Seleccione un servicio"}
            </Text>
          </View>
          {errors.serviceId ? <Text style={styles.errorText}>{errors.serviceId}</Text> : null}
        </View>

        {/* Precio Total */}
        {(formData.totalPrice || 0) > 0 && (
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Precio Total:</Text>
            <Text style={styles.price}>{formatCurrency(formData.totalPrice || 0)}</Text>
          </View>
        )}

        {/* Estado de la Orden */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Estado</Text>
          <View style={styles.statusButtonsContainer}>
            {Object.values(OrderStatus).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  { backgroundColor: getStatusColor(status) },
                  formData.status === status && styles.activeStatusButton
                ]}
                onPress={() => handleChange("status", status)}
              >
                <Text style={styles.statusButtonText}>{getStatusText(status)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.status ? <Text style={styles.errorText}>{errors.status}</Text> : null}
        </View>

        {/* Notas */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notas (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Agregar notas o instrucciones especiales..."
            value={formData.notes || ""}
            onChangeText={(value) => handleChange("notes", value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: tintColor }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Guardar</Text>
            )}
          </TouchableOpacity>
        </View>
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
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  orderInfoContainer: {
    backgroundColor: "#f0f8ff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  selectContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  selectText: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
  },
  priceContainer: {
    backgroundColor: "#f0f8ff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2ecc71",
  },
  statusButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  activeStatusButton: {
    borderWidth: 2,
    borderColor: "#000",
  },
  statusButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  inputError: {
    borderColor: "#d32f2f",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditOrder;
