from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import src.schemas.schemas as schemas
# from src.controller.userController import (changePassword, deleteUser, getUser,
#                                            getUsers, login, registerUser,
#                                            updateUser)
from src.controller.clienteController import (deleteCliente, getCliente,
                                              getClientes, registerCliente,
                                              updateCliente)
from src.database.database import get_session
from src.helpers.auth_bearer import JWTBearer
from src.helpers.utils import get_current_user
from src.models.clienteModel import Cliente
from src.models.empleadoModel import Empleado
from src.schemas.clienteSchema import (ClienteActualizar, ClienteCreate,
                                       ClienteRead)

#from src.helpers.utils import get_current_user, verify_permission


CLIENTE_ROUTES = APIRouter()

@CLIENTE_ROUTES.post("/clientes/registrar")
def register(cliente: ClienteCreate, session: Session = Depends(get_session), current_empleado: Empleado = Depends(get_current_user)):
    if current_empleado.rol_id not in [1, 2]:
        raise HTTPException(status_code=403, detail="No tienes permiso")
    return registerCliente(cliente, session)



# dependencies=[Depends(verify_permission("view_secure_data"))]
@CLIENTE_ROUTES.get("/clientes/todos")
def get_users(db: Session = Depends(get_session), current_empleado: Empleado = Depends(get_current_user)):
    if current_empleado.rol_id not in [1, 2]:
        raise HTTPException(status_code=403, detail="No tienes permiso")
    clientes = db.query(Cliente).all()
    return clientes

@CLIENTE_ROUTES.get('/clientes/{cliente_cedula}', )
def getClienteId(cliente_cedula: int, db: Session = Depends(get_session), current_empleado: Empleado = Depends(get_current_user)):
    if current_empleado.rol_id not in [1, 2]:
        raise HTTPException(status_code=403, detail="No tienes permiso")
    return getCliente(cliente_cedula, db)


@CLIENTE_ROUTES.put('/clientes/actualizar/{Cliente_id}')
def modifyCliente(Cliente_id: int, user_update: ClienteActualizar, db: Session = Depends(get_session), current_empleado: Empleado = Depends(get_current_user)):
    if current_empleado.rol_id not in [1, 2]:
        raise HTTPException(status_code=403, detail="No tienes permiso")
    return updateCliente(Cliente_id, user_update, db)


@CLIENTE_ROUTES.delete('/clientes/eliminar/{Cliente_id}')
def removeUser(Cliente_id: int, db: Session = Depends(get_session), current_empleado: Empleado = Depends(get_current_user)):
    if(current_empleado.rol_id != 1):
        raise HTTPException(status_code=403, detail="No tienes permiso")
    return deleteCliente(Cliente_id, db)


# @CLIENTE_ROUTES.post('/change-password')
# def changeUserPassword(request: schemas.ChangePassword, db: Session = Depends(get_session)):
#     return changePassword(request, db)


# @CLIENTE_ROUTES.post('/login', response_model=schemas.TokenSchema)
# def loginRoute(request: schemas.LoginRequest, db: Session = Depends(get_session)):
#     return login(request, db)
