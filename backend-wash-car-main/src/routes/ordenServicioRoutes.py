from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.controller.ordenServicioController import (deleteOrdenServicio,
                                                    getOrdenesServicio,
                                                    getOrdenServicio,
                                                    registerOrdenServicio,
                                                    updateOrdenServicio)
from src.database.database import get_session
from src.helpers.auth_bearer import JWTBearer
from src.helpers.utils import get_current_user
from src.models.empleadoModel import Empleado
from src.schemas.ordenServicioSchema import (OrdenServicioCreate,
                                             OrdenServicioUpdate)

ORDEN_SERVICIO_ROUTES = APIRouter()

# Registrar una nueva orden de servicio
@ORDEN_SERVICIO_ROUTES.post("/ordenes-servicio/registrar")
def register_orden_servicio(orden_servicio: OrdenServicioCreate, session: Session = Depends(get_session), current_empleado: Empleado = Depends(get_current_user)):

    return registerOrdenServicio(orden_servicio, session)

# Obtener todas las órdenes de servicio
@ORDEN_SERVICIO_ROUTES.get("/ordenes/todos")
async def get_all_ordenes_servicio(
    estado: str = None,
    db: Session = Depends(get_session),
    current_empleado: Empleado = Depends(get_current_user)
):
    print(f"Obteniendo órdenes con estado: {estado}")
    return getOrdenesServicio(db, current_empleado, estado)

# Obtener una orden de servicio por ID
@ORDEN_SERVICIO_ROUTES.get("/ordenes-servicio/{id}")
def get_orden_servicio_by_id(id: int, db: Session = Depends(get_session), current_empleado: Empleado = Depends(get_current_user)):

    return getOrdenServicio(id, db)

# Actualizar una orden de servicio
@ORDEN_SERVICIO_ROUTES.put("/ordenes-servicio/actualizar/{id}")
def update_orden_servicio(id: int, orden_servicio_update: OrdenServicioUpdate, db: Session = Depends(get_session), current_empleado: Empleado = Depends(get_current_user)):
    # if(current_empleado.rol_id != 1 ):
    #     raise HTTPException(status_code=403, detail="No tienes permiso")
    return updateOrdenServicio(id, orden_servicio_update, db)

# Eliminar una orden de servicio
@ORDEN_SERVICIO_ROUTES.delete("/ordenes-servicio/eliminar/{id}")
def delete_orden_servicio(id: int, db: Session = Depends(get_session), current_empleado: Empleado = Depends(get_current_user)):

    return deleteOrdenServicio(id, db)
