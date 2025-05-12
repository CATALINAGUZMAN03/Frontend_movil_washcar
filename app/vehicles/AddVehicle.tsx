import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useVehicles } from "../../hooks/useVehicles";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Vehicle } from "../../types";

const AddVehicle = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;
  const { createVehicle } = useVehicles();
  const [loading, setLoading] = useState(false);

  // Estado para los campos del formulario
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    plate: "",
    clientId: 1, // Por defecto asignamos al cliente ID 1, esto debería ser seleccionable
  });

  // Estado para los errores de validación
  const [errors, setErrors] = useState({
    brand: "",
    model: "",
    year: "",
    plate: "",
  });

  // Manejar cambios en los campos del formulario
  const handleChange = (field: keyof typeof formData, value: string) => {
    // Para el campo year, convertimos el string a número
    if (field === "year") {
      const yearValue = parseInt(value);
      setFormData({
        ...formData,
        [field]: isNaN(yearValue) ? "" : yearValue,
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

    // Validar marca
    if (!formData.brand?.trim()) {
      newErrors.brand = "La marca es requerida";
      isValid = false;
    }

    // Validar modelo
    if (!formData.model?.trim()) {
      newErrors.model = "El modelo es requerido";
      isValid = false;
    }

    // Validar año
    const currentYear = new Date().getFullYear();
    if (!formData.year) {
      newErrors.year = "El año es requerido";
      isValid = false;
    } else if (formData.year < 1900 || formData.year > currentYear + 1) {
      newErrors.year = `El año debe estar entre 1900 y ${currentYear + 1}`;
      isValid = false;
    }

    // Validar placa (formato básico, ajustar según el formato de placas de tu país)
    if (!formData.plate?.trim()) {
      newErrors.plate = "La placa es requerida";
      isValid = false;
    } else if (formData.plate.length < 5) {
      newErrors.plate = "La placa debe tener al menos 5 caracteres";
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
      const response = await createVehicle(formData);

      if (response.error) {
        Alert.alert("Error", response.error.message);
      } else {
        Alert.alert(
          "Éxito",
          "Vehículo agregado correctamente",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo agregar el vehículo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Agregar Vehículo</Text>
      </View>

      <View style={styles.form}>
        {/* Campo de Marca */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Marca</Text>
          <TextInput
            style={[styles.input, errors.brand ? styles.inputError : null]}
            placeholder="Ej. Toyota, Honda, Ford"
            value={formData.brand?.toString()}
            onChangeText={(value) => handleChange("brand", value)}
          />
          {errors.brand ? <Text style={styles.errorText}>{errors.brand}</Text> : null}
        </View>

        {/* Campo de Modelo */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Modelo</Text>
          <TextInput
            style={[styles.input, errors.model ? styles.inputError : null]}
            placeholder="Ej. Corolla, Civic, Fiesta"
            value={formData.model?.toString()}
            onChangeText={(value) => handleChange("model", value)}
          />
          {errors.model ? <Text style={styles.errorText}>{errors.model}</Text> : null}
        </View>

        {/* Campo de Año */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Año</Text>
          <TextInput
            style={[styles.input, errors.year ? styles.inputError : null]}
            placeholder="Ej. 2022"
            value={formData.year?.toString()}
            onChangeText={(value) => handleChange("year", value)}
            keyboardType="numeric"
            maxLength={4}
          />
          {errors.year ? <Text style={styles.errorText}>{errors.year}</Text> : null}
        </View>

        {/* Campo de Placa */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Placa</Text>
          <TextInput
            style={[styles.input, errors.plate ? styles.inputError : null]}
            placeholder="Ej. ABC123"
            value={formData.plate?.toString()}
            onChangeText={(value) => handleChange("plate", value.toUpperCase())}
            autoCapitalize="characters"
          />
          {errors.plate ? <Text style={styles.errorText}>{errors.plate}</Text> : null}
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

export default AddVehicle;
