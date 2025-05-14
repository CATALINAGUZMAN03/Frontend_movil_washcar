# Guía de Configuración Detallada

Esta guía proporciona instrucciones detalladas para configurar tanto el backend como el frontend del sistema de gestión de lavadero de autos.

## Configuración del Backend

### Requisitos

- Python 3.8 o superior
- PostgreSQL
- pip (gestor de paquetes de Python)

### Pasos de Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/CATALINAGUZMAN03/Frontend_movil_washcar.git
   cd Frontend_movil_washcar
   ```

2. **Configurar el entorno virtual**:
   ```bash
   cd backend-wash-car-main
   python -m venv venv
   
   # En Windows:
   venv\Scripts\activate
   
   # En macOS/Linux:
   source venv/bin/activate
   ```

3. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurar la base de datos**:
   
   - Crear una base de datos PostgreSQL
   - Editar el archivo `.env` en la carpeta `backend-wash-car-main`:
   
   ```
   DATABASE_URL="postgresql://usuario:contraseña@host:puerto/nombre_base_datos"
   ```
   
   Ejemplo:
   ```
   DATABASE_URL="postgresql://power_cleaner:kevipao15@localhost:5432/power_cleaner2"
   ```
   
   Asegúrate de reemplazar:
   - `usuario`: Tu usuario de PostgreSQL
   - `contraseña`: Tu contraseña de PostgreSQL
   - `host`: La dirección del servidor (generalmente `localhost`)
   - `puerto`: El puerto de PostgreSQL (generalmente `5432`)
   - `nombre_base_datos`: El nombre de tu base de datos

5. **Iniciar el servidor**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --reload
   ```
   
   El servidor estará disponible en `http://localhost:8000` o `http://0.0.0.0:8000`

### Notas importantes sobre el Backend

- La API utiliza autenticación JWT
- Las credenciales de prueba son:
  - Email: ejemplo@ejemplo.mx
  - Password: kevipao15
- La documentación de la API está disponible en `/docs` (por ejemplo, `http://localhost:8000/docs`)

## Configuración del Frontend

### Requisitos

- Node.js y npm
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (para emulador) o dispositivo Android físico
- Aplicación Expo Go en el dispositivo (si se usa un dispositivo físico)

### Pasos de Instalación

1. **Navegar al directorio del frontend**:
   ```bash
   cd Frontend_movil_washcar
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Instalar dependencias adicionales para el módulo de Gestión de Vehículos y Servicios**:
   ```bash
   npm install @react-native-picker/picker @react-native-community/datetimepicker
   ```

4. **Configurar la conexión con el backend**:
   
   Editar el archivo `hooks/useApi.ts` para configurar la URL del backend:
   
   ```typescript
   // Para emulador Android
   export const API_URL = "http://10.0.2.2:8000";
   
   // Para desarrollo local
   // export const API_URL = "http://localhost:8000";
   
   // Para dispositivo físico en red local (reemplaza con tu IP)
   // export const API_URL = "http://192.168.1.8:8000";
   ```
   
   **Nota importante**: Si estás usando un emulador de Android, usa `10.0.2.2` en lugar de `localhost`. Si estás usando un dispositivo físico, usa la dirección IP de tu computadora en la red local.

5. **Iniciar la aplicación**:
   ```bash
   npx expo start --android
   ```

### Solución de problemas comunes

#### Problema de conexión entre frontend y backend

Si tienes problemas para conectar el frontend con el backend, verifica:

1. **URL correcta**: Asegúrate de que la URL en `hooks/useApi.ts` sea correcta:
   - Para emulador Android: `http://10.0.2.2:8000`
   - Para dispositivo físico: `http://TU_IP_LOCAL:8000`

2. **Firewall**: Asegúrate de que el firewall no esté bloqueando las conexiones

3. **CORS**: El backend ya tiene configurado CORS para permitir todas las conexiones (`allow_origins=["*"]`), pero verifica que esté funcionando correctamente

4. **Red**: Asegúrate de que el dispositivo/emulador y la computadora estén en la misma red

#### Errores de autenticación (403 Invalid token)

Si recibes errores de autenticación:

1. Verifica que estés usando las credenciales correctas
2. Asegúrate de que el token se esté enviando correctamente en las cabeceras
3. El backend tiene una restricción de unicidad para los tokens, lo que puede causar errores si intentas iniciar sesión múltiples veces

## Estructura de la Base de Datos

La base de datos PostgreSQL debe tener las siguientes tablas principales:

- `empleado`: Usuarios del sistema
- `cliente`: Clientes del lavadero
- `vehiculo`: Vehículos de los clientes
- `servicio`: Servicios ofrecidos
- `orden_servicio`: Órdenes de servicio

Las tablas se crearán automáticamente al iniciar el backend por primera vez.

## Pruebas

Para verificar que todo está funcionando correctamente:

1. Inicia el backend
2. Inicia el frontend
3. Intenta iniciar sesión con las credenciales de prueba
4. Navega a la sección de vehículos y crea un nuevo vehículo
5. Navega a la sección de servicios y crea un nuevo servicio
6. Navega a la sección de órdenes y crea una nueva orden
