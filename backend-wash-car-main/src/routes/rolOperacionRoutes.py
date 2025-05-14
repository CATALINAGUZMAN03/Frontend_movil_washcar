from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import src.schemas.schemas as schemas
# from src.controller.userController import (changePassword, deleteUser, getUser,
#                                            getUsers, login, registerUser,
#                                            updateUser)
from src.controller.rolOperacionController import (deleteOperacionRol,
                                                   getOperacionRol,
                                                   getOperacionRols,
                                                   registerOperacionRol,
                                                   updateOperacionRol)
from src.database.database import get_session
from src.helpers.auth_bearer import JWTBearer
from src.helpers.utils import get_current_user
from src.models.rolOperacionModel import RolOperacion
from src.schemas.rolOperacionSchema import (OperacionRolActualizar,
                                            OperacionRolCreate)

#from src.helpers.utils import get_current_user, verify_permission


ROL_OPERACION_ROUTES = APIRouter()

@ROL_OPERACION_ROUTES.post("/operacion-rols/registrar")
def register(operacionRol: OperacionRolCreate, session: Session = Depends(get_session)):
    return registerOperacionRol(operacionRol, session)



# dependencies=[Depends(verify_permission("view_secure_data"))]
@ROL_OPERACION_ROUTES.get("/operacion-rols/todos")
async def get_users(db: Session = Depends(get_session), current_user: RolOperacion = Depends(get_current_user)):
    operacionRols = db.query(RolOperacion).all()
    return operacionRols

@ROL_OPERACION_ROUTES.get('/operacion-rols/{id}', )
def getOperacionRolId(id: int, dependencies=[Depends(JWTBearer())], db: Session = Depends(get_session)):
#def getOperacionRolId(OperacionRol_id: int, db: Session = Depends(get_session)):
    return getOperacionRol(id, db)


@ROL_OPERACION_ROUTES.put('/operacion-rols/actualizar/{id}')
def modifyOperacionRol(id: int, user_update: OperacionRolActualizar, db: Session = Depends(get_session)):
    return updateOperacionRol(id, user_update, db)


@ROL_OPERACION_ROUTES.delete('/operacion-rols/eliminar/{id}')
def removeUser(id: int, db: Session = Depends(get_session)):
    return deleteOperacionRol(id, db)
