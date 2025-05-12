# Guía de Verificación Manual

Esta guía te ayudará a verificar manualmente que la implementación del módulo de Gestión de Vehículos y Servicios funciona correctamente.

## Requisitos Previos

1. Tener instalado Node.js y npm
2. Tener instalado Expo CLI (`npm install -g expo-cli`)
3. Tener un dispositivo Android conectado o un emulador en ejecución
4. Tener instalada la aplicación Expo Go en el dispositivo

## Paso 1: Iniciar la Aplicación

1. Abre una terminal en la carpeta del proyecto (`Frontend_movil_washcar`)
2. Ejecuta el comando `npx expo start`
3. Escanea el código QR que aparece en la terminal con la aplicación Expo Go en tu dispositivo

## Paso 2: Verificar la Gestión de Vehículos

### Listar Vehículos
1. En la pantalla principal, navega a la sección de Vehículos
2. Verifica que se muestra la lista de vehículos (si hay alguno)
3. Si no hay vehículos, verifica que se muestra un mensaje indicando que no hay vehículos disponibles

### Agregar un Vehículo
1. En la pantalla de lista de vehículos, toca el botón "Nuevo Vehículo"
2. Completa el formulario con los siguientes datos:
   - Marca: Toyota
   - Modelo: Corolla
   - Año: 2020
   - Placa: ABC123
3. Toca el botón "Guardar"
4. Verifica que el vehículo aparece en la lista de vehículos

### Ver Detalles de un Vehículo
1. En la lista de vehículos, toca el vehículo que acabas de crear
2. Verifica que se muestra la pantalla de detalles con la información correcta

### Editar un Vehículo
1. En la pantalla de detalles del vehículo, toca el botón "Editar"
2. Modifica el modelo a "Camry"
3. Toca el botón "Guardar"
4. Verifica que los cambios se reflejan en la pantalla de detalles

### Eliminar un Vehículo
1. En la pantalla de detalles del vehículo, toca el botón "Eliminar"
2. Confirma la eliminación
3. Verifica que el vehículo ya no aparece en la lista de vehículos

## Paso 3: Verificar la Gestión de Servicios

### Listar Servicios
1. En la pantalla principal, navega a la sección de Servicios
2. Verifica que se muestra la lista de servicios (si hay alguno)
3. Si no hay servicios, verifica que se muestra un mensaje indicando que no hay servicios disponibles

### Agregar un Servicio
1. En la pantalla de lista de servicios, toca el botón "Nuevo Servicio"
2. Completa el formulario con los siguientes datos:
   - Nombre: Lavado Básico
   - Descripción: Lavado exterior del vehículo
   - Precio: 25000
   - Duración: 30
3. Toca el botón "Guardar"
4. Verifica que el servicio aparece en la lista de servicios

### Ver Detalles de un Servicio
1. En la lista de servicios, toca el servicio que acabas de crear
2. Verifica que se muestra la pantalla de detalles con la información correcta

### Editar un Servicio
1. En la pantalla de detalles del servicio, toca el botón "Editar"
2. Modifica el precio a 30000
3. Toca el botón "Guardar"
4. Verifica que los cambios se reflejan en la pantalla de detalles

### Eliminar un Servicio
1. En la pantalla de detalles del servicio, toca el botón "Eliminar"
2. Confirma la eliminación
3. Verifica que el servicio ya no aparece en la lista de servicios

## Paso 4: Verificar la Gestión de Órdenes

### Listar Órdenes
1. En la pantalla principal, navega a la sección de Órdenes
2. Verifica que se muestra la lista de órdenes (si hay alguna)
3. Si no hay órdenes, verifica que se muestra un mensaje indicando que no hay órdenes disponibles

### Agregar una Orden
1. Primero, asegúrate de tener al menos un vehículo y un servicio creados
2. En la pantalla de lista de órdenes, toca el botón "Nueva Orden"
3. Selecciona un vehículo y un servicio
4. Completa los demás campos del formulario
5. Toca el botón "Crear Orden"
6. Verifica que la orden aparece en la lista de órdenes

### Ver Detalles de una Orden
1. En la lista de órdenes, toca la orden que acabas de crear
2. Verifica que se muestra la pantalla de detalles con la información correcta

### Editar una Orden
1. En la pantalla de detalles de la orden, toca el botón "Editar"
2. Modifica el estado a "En Progreso"
3. Toca el botón "Guardar"
4. Verifica que los cambios se reflejan en la pantalla de detalles

### Cambiar Estado de una Orden
1. En la pantalla de detalles de la orden, toca el botón "Cambiar Estado"
2. Selecciona "Completada"
3. Verifica que el estado de la orden cambia a "Completada"

### Eliminar una Orden
1. En la pantalla de detalles de la orden, toca el botón "Eliminar"
2. Confirma la eliminación
3. Verifica que la orden ya no aparece en la lista de órdenes

## Paso 5: Verificar la Navegación

1. Verifica que puedes navegar entre las diferentes secciones (Vehículos, Servicios, Órdenes)
2. Verifica que puedes volver atrás desde cualquier pantalla
3. Verifica que los botones de navegación funcionan correctamente

## Conclusión

Si todas las verificaciones anteriores son exitosas, significa que la implementación del módulo de Gestión de Vehículos y Servicios funciona correctamente.

## Problemas Comunes y Soluciones

### La aplicación no se inicia
- Verifica que tienes instalado Node.js y npm
- Verifica que tienes instalado Expo CLI
- Verifica que estás en la carpeta correcta del proyecto
- Intenta ejecutar `npm install` antes de iniciar la aplicación

### No puedo agregar/editar/eliminar elementos
- Verifica que tienes conexión a internet
- Verifica que el backend está en ejecución
- Verifica que la URL del backend es correcta en el archivo `hooks/useApi.ts`

### Los cambios no se reflejan inmediatamente
- Intenta hacer pull-to-refresh en la lista
- Reinicia la aplicación
