# Proyecto Carwash - Sistema de Gestión para Lavadero de Autos

Este repositorio contiene tanto el frontend móvil como el backend para un sistema completo de gestión de lavadero de autos.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- **Frontend_movil_washcar**: Aplicación móvil desarrollada con React Native y Expo
- **backend-wash-car-main**: API REST desarrollada con FastAPI y PostgreSQL

## Requisitos Previos

1. Node.js y npm
2. Python 3.8 o superior
3. PostgreSQL
4. Android Studio (para emulador) o dispositivo Android físico

## Instalación Rápida

### Backend

```bash
# Navegar al directorio del backend
cd backend-wash-car-main

# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos
# Editar el archivo .env con los datos de conexión a PostgreSQL

# Iniciar el servidor
uvicorn main:app --host 0.0.0.0 --reload
```

### Frontend

```bash
# Navegar al directorio del frontend
cd Frontend_movil_washcar

# Instalar dependencias
npm install

# Instalar dependencias adicionales para el módulo de Gestión de Vehículos y Servicios
npm install @react-native-picker/picker @react-native-community/datetimepicker

# Iniciar la aplicación
npx expo start --android
```

## Configuración Detallada

Para una configuración más detallada, consulta el archivo [SETUP.md](SETUP.md) que incluye:

- Configuración de la base de datos
- Configuración del entorno de desarrollo
- Solución de problemas comunes
- Instrucciones para conectar el frontend con el backend

## Credenciales de Prueba

- **Email**: ejemplo@ejemplo.mx
- **Password**: kevipao15

## Funcionalidades Principales

- Gestión de servicios (agregar, editar, eliminar, ver detalles)
- Gestión de órdenes de servicio (agregar, editar, eliminar, ver detalles, cambiar estado)
- Autenticación de usuarios
- Roles y permisos

## Contribuir

Si deseas contribuir a este proyecto, por favor:

1. Haz un fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request
