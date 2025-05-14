import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Cargar variables del archivo .env
load_dotenv()

# Acceder a la variable DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL no está definida en el archivo .env")

# Importar rutas y base de datos
from src.database.database import Base, engine
from src.routes.clienteRoutes import CLIENTE_ROUTES
from src.routes.moduloRoutes import MODULO_ROUTES
from src.routes.operacionRoutes import OPERACION_ROUTES
from src.routes.ordenServicioRoutes import ORDEN_SERVICIO_ROUTES
from src.routes.pagoRoutes import PAGOS_ROUTES
# from src.routes.passwordResetRouter import PASSWORD_RESET_ROUTES
# from src.routes.permissionRouter import PERMISSION_ROUTES
# from src.routes.rol_permissionRoutes import ROL_PERMISSION_ROUTES
from src.routes.roleRoutes import ROLE_ROUTES
from src.routes.rolOperacionRoutes import ROL_OPERACION_ROUTES
from src.routes.servicioRoutes import SERVICIO_ROUTES
from src.routes.userRouter import USER_ROUTES
from src.routes.vehiculoRoutes import VEHICULO_ROUTES

# Crear las tablas en la base de datos
Base.metadata.create_all(engine)

# Inicializar la aplicación FastAPI
app = FastAPI()

# Incluir las rutas de usuario
app.include_router(USER_ROUTES)

# # Incluir las rutas de permisos
# app.include_router(PERMISSION_ROUTES)

# # Incluir las rutas de restablecimiento de contraseña
# app.include_router(PASSWORD_RESET_ROUTES)

# Verificar permisos
app.include_router(ORDEN_SERVICIO_ROUTES)

# Incluir las rutas de roles
app.include_router(ROLE_ROUTES)

# # Incluir las rutas de CLIENTE
app.include_router(CLIENTE_ROUTES)

# # Incluir las rutas de vehiculo
app.include_router(VEHICULO_ROUTES)

# # Incluir las rutas de SERVICIOS
app.include_router(SERVICIO_ROUTES)

# # Incluir las rutas para variedades de arroz
app.include_router(MODULO_ROUTES)

# # Incluir las rutas para operacion
app.include_router(OPERACION_ROUTES)

# # Incluir las rutas para ROL operacion
app.include_router(ROL_OPERACION_ROUTES)

app.include_router(PAGOS_ROUTES)

# Configuración del middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambié a '*' temporalmente para pruebas. Ajusta esto en producción.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
