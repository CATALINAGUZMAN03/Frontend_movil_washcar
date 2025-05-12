# Aplicación Móvil para Lavadero de Autos

Esta aplicación móvil permite gestionar un lavadero de autos, incluyendo la gestión de vehículos, servicios y órdenes de servicio.

## Módulos Implementados

### Gestión de Vehículos y Servicios

Este módulo permite:

- Gestionar vehículos (agregar, editar, eliminar, ver detalles)
- Gestionar servicios (agregar, editar, eliminar, ver detalles)
- Gestionar órdenes de servicio (agregar, editar, eliminar, ver detalles, cambiar estado)

## Requisitos Previos

1. Tener instalado Node.js y npm
2. Tener instalado Expo CLI (`npm install -g expo-cli`)
3. Tener un dispositivo Android conectado o un emulador en ejecución
4. Tener instalada la aplicación Expo Go en el dispositivo

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/CATALINAGUZMAN03/Frontend_movil_washcar.git
   ```

2. Navega a la carpeta del proyecto:
   ```bash
   cd Frontend_movil_washcar
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Instala las dependencias adicionales para el módulo de Gestión de Vehículos y Servicios:
   ```bash
   npm install @react-native-picker/picker @react-native-community/datetimepicker
   ```

## Ejecución

1. Inicia la aplicación:
   ```bash
   npx expo start
   ```

2. Escanea el código QR que aparece en la terminal con la aplicación Expo Go en tu dispositivo

## Configuración del Backend

Para que la aplicación funcione correctamente, necesitas un backend que proporcione los endpoints necesarios. Puedes:

1. Usar un backend existente: Actualiza la URL base en el archivo `hooks/useApi.ts`
2. Configurar un backend de prueba: Sigue las instrucciones en el archivo `BACKEND_PRUEBA.md`

## Estructura de Carpetas

```
/app
  /orders
    - AddOrder.tsx
    - EditOrder.tsx
    - OrderDetails.tsx
    - OrderList.tsx
  /services
    - AddService.tsx
    - EditService.tsx
    - ServiceDetails.tsx
    - ServiceList.tsx
  /vehicles
    - AddVehicle.tsx
    - EditVehicle.tsx
    - VehicleDetails.tsx
    - VehicleList.tsx
/components
  - OrderCard.tsx
  - ServiceCard.tsx
  - VehicleCard.tsx
  /ui
    - IconSymbol.tsx
/hooks
  - useApi.ts
  - useOrders.ts
  - useServices.ts
  - useVehicles.ts
/types
  - index.ts
```

## Verificación Manual

Para verificar manualmente que la implementación funciona correctamente, sigue las instrucciones en el archivo `VERIFICACION_MANUAL.md`.

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request
