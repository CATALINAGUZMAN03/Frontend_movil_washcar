import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useServices } from "../../hooks/useServices";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Service } from "../../types";

const EditService = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const serviceId = typeof params.id === 'string' ? parseInt(params.id) : 0;

  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;
  const { getService, updateService } = useServices();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Estado para los campos del formulario
  const [formData, setFormData] = useState<Partial<Service>>({
    name: "",
    description: "",
    price: 0,
    duration: 30,
  });

  // Estado para los errores de validación
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  // Cargar los datos del servicio al iniciar
  useEffect(() => {
    const loadService = async () => {
      if (serviceId) {
        try {
          const response = await getService(serviceId);
          if (response.data) {
            setFormData(response.data);
          } else if (response.error) {
            Alert.alert("Error", response.error.message);
            router.back();
          }
        } catch (error: any) {
          Alert.alert("Error", error.message || "No se pudo cargar el servicio");
          router.back();
        } finally {
          setInitialLoading(false);
        }
      } else {
        Alert.alert("Error", "ID de servicio no válido");
        router.back();
      }
    };

    loadService();
  }, [serviceId]);

  // Manejar cambios en los campos del formulario
  const handleChange = (field: keyof typeof formData, value: string) => {
    // Para campos numéricos, convertimos el string a número
    if (field === "price" || field === "duration") {
      const numValue = parseFloat(value);
      setFormData({
        ...formData,
        [field]: isNaN(numValue) ? 0 : numValue,
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }

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

    // Validar nombre
    if (!formData.name?.trim()) {
      newErrors.name = "El nombre es requerido";
      isValid = false;
    }

    // Validar descripción
    if (!formData.description?.trim()) {
      newErrors.description = "La descripción es requerida";
      isValid = false;
    }

    // Validar precio
    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = "El precio debe ser un valor positivo";
      isValid = false;
    }

    // Validar duración
    if (formData.duration === undefined || formData.duration <= 0) {
      newErrors.duration = "La duración debe ser mayor a 0 minutos";
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
      const response = await updateService(serviceId, formData);

      if (response.error) {
        Alert.alert("Error", response.error.message);
      } else {
        Alert.alert(
          "Éxito",
          "Servicio actualizado correctamente",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo actualizar el servicio");
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

  if (initialLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={tintColor} />
        <Text style={styles.loadingText}>Cargando datos del servicio...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Editar Servicio</Text>
      </View>

      <View style={styles.form}>
        {/* Campo de Nombre */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre del Servicio</Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            placeholder="Ej. Lavado Básico, Encerado, etc."
            value={formData.name}
            onChangeText={(value) => handleChange("name", value)}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        {/* Campo de Descripción */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.description ? styles.inputError : null]}
            placeholder="Describe el servicio..."
            value={formData.description}
            onChangeText={(value) => handleChange("description", value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
        </View>

        {/* Campo de Precio */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Precio</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={[styles.input, styles.priceInput, errors.price ? styles.inputError : null]}
              placeholder="0"
              value={formData.price?.toString()}
              onChangeText={(value) => handleChange("price", value)}
              keyboardType="numeric"
            />
          </View>
          {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
          {formData.price ? (
            <Text style={styles.formattedPrice}>
              {formatCurrency(formData.price)}
            </Text>
          ) : null}
        </View>

        {/* Campo de Duración */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Duración (minutos)</Text>
          <TextInput
            style={[styles.input, errors.duration ? styles.inputError : null]}
            placeholder="30"
            value={formData.duration?.toString()}
            onChangeText={(value) => handleChange("duration", value)}
            keyboardType="numeric"
          />
          {errors.duration ? <Text style={styles.errorText}>{errors.duration}</Text> : null}
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
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: 18,
    marginRight: 8,
    color: "#333",
  },
  priceInput: {
    flex: 1,
  },
  formattedPrice: {
    marginTop: 8,
    fontSize: 14,
    color: "#2ecc71",
    fontWeight: "500",
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

export default EditService;
