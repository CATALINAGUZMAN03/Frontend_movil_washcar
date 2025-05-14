# Guía de Conexión entre Frontend y Backend

Esta guía explica cómo configurar correctamente la conexión entre el frontend móvil y el backend del sistema de lavadero de autos.

## Configuración del Backend

1. **Asegúrate de que el backend esté ejecutándose correctamente**:
   ```bash
   cd backend-wash-car-main
   uvicorn main:app --host 0.0.0.0 --reload
   ```

   El parámetro `--host 0.0.0.0` es importante para que el servidor sea accesible desde otros dispositivos en la red.

2. **Verifica que el backend esté funcionando** accediendo a la documentación de la API:
   - Si estás en la misma máquina: http://localhost:8000/docs
   - Si estás en otra máquina: http://IP_DE_TU_COMPUTADORA:8000/docs

## Configuración del Frontend

La configuración de la URL del backend se realiza en el archivo `hooks/useApi.ts` del proyecto frontend.

### Opciones de configuración según el entorno

1. **Para emulador de Android Studio**:
   ```typescript
   export const API_URL = "http://10.0.2.2:8000";
   ```
   
   El emulador de Android usa `10.0.2.2` para acceder al localhost de la máquina host.

2. **Para desarrollo local (web)**:
   ```typescript
   export const API_URL = "http://localhost:8000";
   ```

3. **Para dispositivo físico en la misma red WiFi**:
   ```typescript
   export const API_URL = "http://192.168.1.X:8000";
   ```
   
   Reemplaza `192.168.1.X` con la dirección IP de tu computadora en la red local.

### Cómo encontrar la dirección IP de tu computadora

#### En Windows:
1. Abre una terminal (cmd o PowerShell)
2. Ejecuta el comando `ipconfig`
3. Busca la sección de tu adaptador de red (WiFi o Ethernet)
4. Anota la dirección IPv4 (por ejemplo, 192.168.1.5)

#### En macOS/Linux:
1. Abre una terminal
2. Ejecuta el comando `ifconfig` o `ip addr`
3. Busca la sección de tu adaptador de red (WiFi o Ethernet)
4. Anota la dirección IP (por ejemplo, 192.168.1.5)

## Solución de problemas comunes

### 1. No se puede conectar al backend

Si recibes errores como "Network Error" o "Failed to fetch":

- **Verifica que el backend esté ejecutándose** con el parámetro `--host 0.0.0.0`
- **Comprueba la URL configurada** en `hooks/useApi.ts`
- **Verifica que no haya un firewall bloqueando** las conexiones al puerto 8000
- **Asegúrate de que el dispositivo y la computadora** estén en la misma red WiFi

### 2. Errores de CORS

Si recibes errores relacionados con CORS (Cross-Origin Resource Sharing):

- Verifica que el backend tenga configurado correctamente el middleware CORS:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],  # Para desarrollo
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

### 3. Errores de autenticación (403 Invalid token)

Si recibes errores de autenticación:

- **Verifica las credenciales**: Usa las credenciales de prueba (email: ejemplo@ejemplo.mx, password: kevipao15)
- **Comprueba que el token se envía correctamente** en las cabeceras de las peticiones
- **Ten en cuenta que el backend tiene una restricción de unicidad para los tokens**, lo que puede causar errores si intentas iniciar sesión múltiples veces

## Prueba de conexión

Para verificar que la conexión funciona correctamente:

1. Inicia el backend: `uvicorn main:app --host 0.0.0.0 --reload`
2. Inicia el frontend: `npx expo start --android`
3. Intenta iniciar sesión con las credenciales de prueba
4. Si puedes iniciar sesión y ver los datos, la conexión está configurada correctamente
