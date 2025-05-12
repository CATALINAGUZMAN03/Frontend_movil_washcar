# Configuración de Backend de Prueba

Para probar completamente la aplicación, necesitamos un backend que proporcione los endpoints necesarios. A continuación, se describe cómo configurar un backend de prueba utilizando json-server.

## Requisitos Previos

1. Tener instalado Node.js y npm

## Paso 1: Instalar json-server

```bash
npm install -g json-server
```

## Paso 2: Crear un archivo db.json

Crea un archivo llamado `db.json` en la carpeta raíz del proyecto con el siguiente contenido:

```json
{
  "vehicles": [
    {
      "id": 1,
      "brand": "Toyota",
      "model": "Corolla",
      "year": 2020,
      "plate": "ABC123",
      "clientId": 1,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "brand": "Honda",
      "model": "Civic",
      "year": 2019,
      "plate": "DEF456",
      "clientId": 2,
      "createdAt": "2023-01-02T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z"
    },
    {
      "id": 3,
      "brand": "Ford",
      "model": "Mustang",
      "year": 2021,
      "plate": "GHI789",
      "clientId": 3,
      "createdAt": "2023-01-03T00:00:00.000Z",
      "updatedAt": "2023-01-03T00:00:00.000Z"
    }
  ],
  "services": [
    {
      "id": 1,
      "name": "Lavado Básico",
      "description": "Lavado exterior del vehículo",
      "price": 25000,
      "duration": 30,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Lavado Completo",
      "description": "Lavado exterior e interior del vehículo",
      "price": 40000,
      "duration": 60,
      "createdAt": "2023-01-02T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z"
    },
    {
      "id": 3,
      "name": "Encerado",
      "description": "Encerado y pulido del vehículo",
      "price": 35000,
      "duration": 45,
      "createdAt": "2023-01-03T00:00:00.000Z",
      "updatedAt": "2023-01-03T00:00:00.000Z"
    }
  ],
  "orders": [
    {
      "id": 1,
      "vehicleId": 1,
      "serviceId": 1,
      "status": "pending",
      "startDate": "2023-01-10T10:00:00.000Z",
      "endDate": null,
      "totalPrice": 25000,
      "notes": "Cliente frecuente",
      "createdAt": "2023-01-09T00:00:00.000Z",
      "updatedAt": "2023-01-09T00:00:00.000Z"
    },
    {
      "id": 2,
      "vehicleId": 2,
      "serviceId": 2,
      "status": "in_progress",
      "startDate": "2023-01-11T11:00:00.000Z",
      "endDate": null,
      "totalPrice": 40000,
      "notes": "Prestar atención a los asientos",
      "createdAt": "2023-01-10T00:00:00.000Z",
      "updatedAt": "2023-01-10T00:00:00.000Z"
    },
    {
      "id": 3,
      "vehicleId": 3,
      "serviceId": 3,
      "status": "completed",
      "startDate": "2023-01-12T12:00:00.000Z",
      "endDate": "2023-01-12T13:00:00.000Z",
      "totalPrice": 35000,
      "notes": "Vehículo nuevo",
      "createdAt": "2023-01-11T00:00:00.000Z",
      "updatedAt": "2023-01-12T13:00:00.000Z"
    }
  ],
  "clients": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "1234567890",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "María López",
      "email": "maria@example.com",
      "phone": "0987654321",
      "createdAt": "2023-01-02T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z"
    },
    {
      "id": 3,
      "name": "Carlos Rodríguez",
      "email": "carlos@example.com",
      "phone": "5555555555",
      "createdAt": "2023-01-03T00:00:00.000Z",
      "updatedAt": "2023-01-03T00:00:00.000Z"
    }
  ]
}
```

## Paso 3: Iniciar json-server

```bash
json-server --watch db.json --port 3000
```

## Paso 4: Actualizar la URL del Backend en la Aplicación

Abre el archivo `hooks/useApi.ts` y actualiza la URL base para que apunte a tu servidor json-server:

```typescript
// URL base para la API
const BASE_URL = "http://localhost:3000"; // Cambia esto según tu configuración
```

Si estás probando en un dispositivo físico, necesitarás usar la dirección IP de tu computadora en lugar de `localhost`. Por ejemplo:

```typescript
// URL base para la API
const BASE_URL = "http://192.168.1.100:3000"; // Cambia esto según tu configuración
```

## Paso 5: Reiniciar la Aplicación

Reinicia la aplicación para que los cambios surtan efecto.

## Notas Importantes

- json-server es solo para pruebas y no debe usarse en producción
- Los cambios que hagas en la aplicación se guardarán en el archivo `db.json`
- Si quieres restablecer los datos, simplemente detén json-server, edita el archivo `db.json` y vuelve a iniciar json-server
