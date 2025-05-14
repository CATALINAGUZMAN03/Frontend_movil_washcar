from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import src.schemas.schemas as schemas
# from src.controller.userController import (changePassword, deleteUser, getUser,
#                                            getUsers, login, registerUser,
#                                            updateUser)
from src.controller.operacionController import (deleteOperacion, getOperacion,
                                                getOperacions,
                                                registerOperacion,
                                                updateOperacion)
from src.database.database import get_session
from src.helpers.auth_bearer import JWTBearer
from src.helpers.utils import get_current_user
from src.models.operacionModel import Operacion
from src.schemas.operacionSchema import OperacionActualizar, OperacionCreate

#from src.helpers.utils import get_current_user, verify_permission


OPERACION_ROUTES = APIRouter()

@OPERACION_ROUTES.post("/operacions/registrar")
def register(operacion: OperacionCreate, session: Session = Depends(get_session)):
    return registerOperacion(operacion, session)



# dependencies=[Depends(verify_permission("view_secure_data"))]
@OPERACION_ROUTES.get("/operacions/todos")
async def get_users(db: Session = Depends(get_session), current_user: Operacion = Depends(get_current_user)):
    operacions = db.query(Operacion).all()
    return operacions

@OPERACION_ROUTES.get('/operacions/{id}', )
def getOperacionId(id: int, dependencies=[Depends(JWTBearer())], db: Session = Depends(get_session)):
#def getOperacionId(Operacion_id: int, db: Session = Depends(get_session)):
    return getOperacion(id, db)


@OPERACION_ROUTES.put('/operacions/actualizar/{id}')
def modifyOperacion(id: int, user_update: OperacionActualizar, db: Session = Depends(get_session)):
    return updateOperacion(id, user_update, db)


@OPERACION_ROUTES.delete('/operacions/eliminar/{id}')
def removeUser(id: int, db: Session = Depends(get_session)):
    return deleteOperacion(id, db)
