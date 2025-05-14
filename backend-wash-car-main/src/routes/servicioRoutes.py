from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import src.schemas.schemas as schemas
from src.controller.servicioController import (deleteServicio, getServicio,
                                               getServicios, registerServicio,
                                               updateServicio)
from src.database.database import get_session
from src.helpers.auth_bearer import JWTBearer
from src.helpers.utils import get_current_user
from src.models.empleadoModel import Empleado
from src.models.servicioModel import Servicio
from src.schemas.servicioSchema import ServicioActualizar, ServicioCreate

#from src.helpers.utils import get_current_user, verify_permission


SERVICIO_ROUTES = APIRouter()
@SERVICIO_ROUTES.post("/servicios/registrar")
def register(servicio: ServicioCreate, session: Session = Depends(get_session), current_empleado: Empleado = Depends(get_current_user)):
    if current_empleado.rol_id not in [1, 2]:
        raise HTTPException(status_code=403, detail="No tienes permiso")
    return registerServicio(servicio, session)



# dependencies=[Depends(verify_permission("view_secure_data"))]
@SERVICIO_ROUTES.get("/servicios/todos")
async def get_users(db: Session = Depends(get_session) ):
    servicios = db.query(Servicio).all()
    return servicios

@SERVICIO_ROUTES.get('/servicios/{id}', )
def getServicioId(id: int, db: Session = Depends(get_session), current_empleado: Empleado = Depends(get_current_user)):
    if current_empleado.rol_id not in [1, 2]:
        raise HTTPException(status_code=403, detail="No tienes permiso")
    return getServicio(id, db)


@SERVICIO_ROUTES.put('/servicios/actualizar/{id}')
def modifyServicio(id: int, user_update: ServicioActualizar, db: Session = Depends(get_session),current_empleado: Empleado = Depends(get_current_user)):
    if current_empleado.rol_id not in [1, 2]:
        raise HTTPException(status_code=403, detail="No tienes permiso")
    return updateServicio(id, user_update, db)


@SERVICIO_ROUTES.delete('/servicios/eliminar/{id}')
def removeUser(id: int, db: Session = Depends(get_session),current_empleado: Empleado = Depends(get_current_user)):
    if(current_empleado.rol_id != 1):
        raise HTTPException(status_code=403, detail="No tienes permiso")
    return deleteServicio(id, db)
