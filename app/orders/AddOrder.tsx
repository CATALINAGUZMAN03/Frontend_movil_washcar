import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useOrders } from "../../hooks/useOrders";
import { useVehicles } from "../../hooks/useVehicles";
import { useServices } from "../../hooks/useServices";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Order, OrderStatus, Vehicle, Service } from "../../types";
// Nota: Estos paquetes necesitan ser instalados:
// npm install @react-native-picker/picker @react-native-community/datetimepicker
// Por ahora, usaremos componentes nativos de React Native

const AddOrder = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialVehicleId = typeof params.vehicleId === 'string' ? parseInt(params.vehicleId) : undefined;
  const initialServiceId = typeof params.serviceId === 'string' ? parseInt(params.serviceId) : undefined;

  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const { createOrder } = useOrders();
  const { vehicles, loading: loadingVehicles } = useVehicles();
  const { services, loading: loadingServices } = useServices();

  const [loading, setLoading] = useState(false);

  // Estado para los campos del formulario
  const [formData, setFormData] = useState<Partial<Order>>({
    vehicleId: initialVehicleId || 0,
    serviceId: initialServiceId || 0,
    status: OrderStatus.PENDING,
    startDate: new Date().toISOString(),
    totalPrice: 0,
    notes: "",
  });

  // Estado para los errores de validación
  const [errors, setErrors] = useState({
    vehicleId: "",
    serviceId: "",
    startDate: "",
    notes: "",
  });

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

  // Nota: Esta función se usaría con el DateTimePicker real

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

    // Validar fecha
    if (!formData.startDate) {
      newErrors.startDate = "La fecha es requerida";
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
      const response = await createOrder(formData);

      if (response.error) {
        Alert.alert("Error", response.error.message);
      } else {
        Alert.alert(
          "Éxito",
          "Orden creada correctamente",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo crear la orden");
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

  if (loadingVehicles || loadingServices) {
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
        <Text style={styles.title}>Crear Orden de Servicio</Text>
      </View>

      <View style={styles.form}>
        {/* Selección de Vehículo */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Vehículo</Text>
          <View style={[styles.pickerContainer, errors.vehicleId ? styles.inputError : null]}>
            {/* Selector simplificado - en una implementación real, usar @react-native-picker/picker */}
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => {
                // Aquí se mostraría un modal con opciones
                // Por simplicidad, seleccionamos el primer vehículo disponible si hay alguno
                if (vehicles.length > 0) {
                  handleChange("vehicleId", vehicles[0].id);
                }
              }}
            >
              <Text style={styles.pickerButtonText}>
                {formData.vehicleId && vehicles.find(v => v.id === formData.vehicleId)
                  ? `${vehicles.find(v => v.id === formData.vehicleId)?.brand} ${vehicles.find(v => v.id === formData.vehicleId)?.model}`
                  : "Seleccione un vehículo"}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.vehicleId ? <Text style={styles.errorText}>{errors.vehicleId}</Text> : null}
        </View>

        {/* Selección de Servicio */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Servicio</Text>
          <View style={[styles.pickerContainer, errors.serviceId ? styles.inputError : null]}>
            {/* Selector simplificado - en una implementación real, usar @react-native-picker/picker */}
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => {
                // Aquí se mostraría un modal con opciones
                // Por simplicidad, seleccionamos el primer servicio disponible si hay alguno
                if (services.length > 0) {
                  handleChange("serviceId", services[0].id);
                }
              }}
            >
              <Text style={styles.pickerButtonText}>
                {formData.serviceId && services.find(s => s.id === formData.serviceId)
                  ? `${services.find(s => s.id === formData.serviceId)?.name}`
                  : "Seleccione un servicio"}
              </Text>
            </TouchableOpacity>
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

        {/* Fecha de Inicio */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Fecha de Inicio</Text>
          <TouchableOpacity
            style={[styles.dateButton, errors.startDate ? styles.inputError : null]}
            onPress={() => {
              // En una implementación real, aquí se mostraría un DateTimePicker
              // Por simplicidad, establecemos la fecha actual
              handleChange("startDate", new Date().toISOString());
            }}
          >
            <Text style={styles.dateButtonText}>
              {formData.startDate ? formatDate(formData.startDate) : "Seleccionar fecha"}
            </Text>
          </TouchableOpacity>
          {/* Nota: DateTimePicker requiere instalación del paquete @react-native-community/datetimepicker */}
          {errors.startDate ? <Text style={styles.errorText}>{errors.startDate}</Text> : null}
        </View>

        {/* Notas */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notas (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Agregar notas o instrucciones especiales..."
            value={formData.notes}
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
              <Text style={styles.buttonText}>Crear Orden</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
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
  pickerContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  pickerButton: {
    padding: 12,
    backgroundColor: "#fff",
  },
  pickerButtonText: {
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
  dateButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    alignItems: "flex-start",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
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

export default AddOrder;
