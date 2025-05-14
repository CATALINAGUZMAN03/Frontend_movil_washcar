from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import src.schemas.schemas as schemas
# from src.controller.userController import (changePassword, deleteUser, getUser,
#                                            getUsers, login, registerUser,
#                                            updateUser)
from src.controller.vehiculoController import (deleteVehiculo, getVehiculo,
                                               getVehiculos, registerVehiculo,
                                               updateVehiculo)
from src.database.database import get_session
from src.helpers.auth_bearer import JWTBearer
from src.helpers.utils import get_current_user
from src.models.empleadoModel import Empleado
from src.models.vehiculoModel import Vehiculo
from src.schemas.vehiculoSchema import VehiculoActualizar, VehiculoCreate

#from src.helpers.utils import get_current_user, verify_permission


VEHICULO_ROUTES = APIRouter()

@VEHICULO_ROUTES.post("/vehiculos/registrar")
def register(vehiculo: VehiculoCreate, session: Session = Depends(get_session), current_empleado: Empleado = Depends(get_current_user)):
    if current_empleado.rol_id not in [1, 2]:
        raise HTTPException(status_code=403, detail="No tienes permiso")
    return registerVehiculo(vehiculo, session)



# dependencies=[Depends(verify_permission("view_secure_data"))]
@VEHICULO_ROUTES.get("/vehiculos/todos")
async def get_users(db: Session = Depends(get_session), current_empleado: Empleado = Depends(get_current_user)):
    if current_empleado.rol_id not in [1, 2]:
        raise HTTPException(status_code=403, detail="No tienes permiso")
    try:
        # Obtenemos los vehículos usando una consulta directa para evitar cargar relaciones
        # Usamos .options(load_only()) para cargar solo las columnas que necesitamos
        vehiculos = db.query(Vehiculo).all()

        # Imprimimos la cantidad de vehículos para depuración
        print(f"Total de vehículos encontrados: {len(vehiculos)}")

        # Convertimos los objetos SQLAlchemy a diccionarios para evitar problemas de serialización
        vehiculos_dict = []
        for v in vehiculos:
            vehiculo_dict = {
                "vehiculo_id": v.vehiculo_id,
                "cliente_cedula": v.cliente_cedula,
                "marca": v.marca,
                "modelo": v.modelo,
                "placa": v.placa,
                "color": v.color,
                "tipo": v.tipo,
                "nombre": v.nombre
            }
            vehiculos_dict.append(vehiculo_dict)

        # Imprimimos la cantidad de vehículos convertidos para depuración
        print(f"Total de vehículos convertidos a diccionario: {len(vehiculos_dict)}")

        # Verificamos que no haya limitación en la cantidad de vehículos
        if len(vehiculos_dict) > 0:
            print(f"Primer vehículo: {vehiculos_dict[0]}")
            print(f"Último vehículo: {vehiculos_dict[-1]}")

        # Devolvemos todos los vehículos sin limitación
        return vehiculos_dict
    except Exception as e:
        print(f"Error al obtener vehículos: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al obtener vehículos: {str(e)}")

@VEHICULO_ROUTES.get('/vehiculos/{placa}', )
def getVehiculoId(placa: str, current_empleado: Empleado = Depends(get_current_user), db: Session = Depends(get_session)):
    if current_empleado.rol_id not in [1, 2]:
        raise HTTPException(status_code=403, detail="No tienes permiso")
    try:
        vehiculo = getVehiculo(placa, db)
        # Convertimos el objeto SQLAlchemy a diccionario para evitar problemas de serialización
        return {
            "vehiculo_id": vehiculo.vehiculo_id,
            "cliente_cedula": vehiculo.cliente_cedula,
            "marca": vehiculo.marca,
            "modelo": vehiculo.modelo,
            "placa": vehiculo.placa,
            "color": vehiculo.color,
            "tipo": vehiculo.tipo,
            "nombre": vehiculo.nombre
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener vehículo: {str(e)}")


@VEHICULO_ROUTES.put('/vehiculos/actualizar/{placa}')
def modifyVehiculo(placa: str, user_update: VehiculoActualizar, db: Session = Depends(get_session),  current_empleado: Empleado = Depends(get_current_user)):
    if current_empleado.rol_id not in [1, 2]:
        raise HTTPException(status_code=403, detail="No tienes permiso")
    return updateVehiculo(placa, user_update, db)


@VEHICULO_ROUTES.delete('/vehiculos/eliminar/{placa}')
def removeUser(placa: str, db: Session = Depends(get_session),  current_empleado: Empleado = Depends(get_current_user)):
    if current_empleado.rol_id != 1:
        raise HTTPException(status_code=403, detail="No tienes permiso")
    return deleteVehiculo(placa, db)


# @Vehiculo_ROUTES.post('/change-password')
# def changeUserPassword(request: schemas.ChangePassword, db: Session = Depends(get_session)):
#     return changePassword(request, db)


# @Vehiculo_ROUTES.post('/login', response_model=schemas.TokenSchema)
# def loginRoute(request: schemas.LoginRequest, db: Session = Depends(get_session)):
#     return login(request, db)
