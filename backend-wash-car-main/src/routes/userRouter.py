from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import src.schemas.schemas as schemas
from src.controller.userController import (deleteEmpleado, getEmpleado,
                                           getEmpleados, login,
                                           registerEmpleado, updateEmpleado)
from src.database.database import get_session
from src.helpers.auth_bearer import JWTBearer
from src.helpers.utils import get_current_user
from src.models.empleadoModel import Empleado
from src.schemas.empleadoSchema import EmpleadoActualizar, EmpleadoCreate

USER_ROUTES = APIRouter()

@USER_ROUTES.post("/empleados/registrar")
def register(empleado: EmpleadoCreate, session: Session = Depends(get_session), current_empleado: Empleado = Depends(get_current_user)):
    if(current_empleado.rol_id != 1 ):
        raise HTTPException(status_code=403, detail="No tienes permiso")
    return registerEmpleado(empleado, session)

@USER_ROUTES.post('/login')
def loginRoute(request: schemas.LoginRequest, db: Session = Depends(get_session)):
    return login(request, db)
  

# dependencies=[Depends(verify_permission("view_secure_data"))]
@USER_ROUTES.get("/empleados/todos")
async def get_users(db: Session = Depends(get_session), current_user: Empleado = Depends(get_current_user)):
    if(current_user.rol_id != 1 ):
        raise HTTPException(status_code=403, detail="No tienes permiso")
    
    users = db.query(Empleado).all()
    return users

@USER_ROUTES.get('/empleados/{empleado_id}', )
def getEmpleadoId(empleado_id: int, db: Session = Depends(get_session),  current_empleado: Empleado = Depends(get_current_user)):
    if(current_empleado.rol_id != 1):
        raise HTTPException(status_code=403, detail="No tienes permiso")
    return getEmpleado(empleado_id, db)


@USER_ROUTES.put('/empleados/actualizar/{empleado_id}')
def modifyEmpleado(empleado_id: int, user_update: EmpleadoActualizar, db: Session = Depends(get_session), current_empleado: Empleado = Depends(get_current_user)):
    if(current_empleado.rol_id != 1):
        raise HTTPException(status_code=403, detail="No tienes permiso")
    return updateEmpleado(empleado_id, user_update, db)


@USER_ROUTES.delete('/empleados/eliminar/{empleado_id}')
def removeUser(empleado_id: int, db: Session = Depends(get_session),  current_empleado: Empleado = Depends(get_current_user)):
    if(current_empleado.rol_id != 1):
        raise HTTPException(status_code=403, detail="No tienes permiso")
    return deleteEmpleado(empleado_id, db)


# @USER_ROUTES.post('/change-password')
# def changeUserPassword(request: schemas.ChangePassword, db: Session = Depends(get_session)):
#     return changePassword(request, db)
