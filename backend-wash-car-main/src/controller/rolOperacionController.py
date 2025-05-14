from fastapi import Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from src.database.database import get_session
from src.helpers.auth_bearer import JWTBearer
from src.helpers.utils import get_current_user, get_hashed_password
from src.models.rolOperacionModel import RolOperacion
from src.schemas.rolOperacionSchema import (OperacionRolActualizar,
                                            OperacionRolCreate)


def registerOperacionRol(operacion_rol: OperacionRolCreate, session: Session = Depends(get_session)):
    existingOperacionRol = session.query(RolOperacion).filter_by(id=operacion_rol.id).first()
    if existingOperacionRol:
        raise HTTPException(status_code=400, detail="OperacionRol ya existe ")
    #newOperacionRol = OperacionRol(cliente_cedula = OperacionRol.cliente_cedula, marca = OperacionRol.marca, modelo = OperacionRol.modelo, placa = OperacionRol.placa, color = OperacionRol.color, tipo = OperacionRol.tipo)
    newOperacionRol = RolOperacion(**operacion_rol.dict())

    session.add(newOperacionRol)
    session.commit()
    session.refresh(newOperacionRol)

    return {"message":"OperacionRol creado"}


def getOperacionRols(db: Session = Depends(get_session), current_user: RolOperacion = Depends(get_current_user)):
    OperacionRols = db.query(RolOperacion).all()
    return OperacionRols

def getOperacionRol(id: str, db: Session = Depends(get_session)):
#def getOperacionRol(OperacionRol_id: int, dependencies=[Depends(JWTBearer())], db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    
    operacionRol = db.query(RolOperacion).filter(RolOperacion.id == id).first()
    if operacionRol is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="OperacionRol not found")
    return operacionRol



def updateOperacionRol(id: int, OperacionRol_update: OperacionRolActualizar, db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    operacionRol = db.query(RolOperacion).filter(RolOperacion.id == id).first()

    if operacionRol is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="OperacionRol not found")

    # Actualizar la información del usuario solo si se proporciona un nuevo valor
    if OperacionRol_update.rol_id is not None:
        operacionRol.rol_id = OperacionRol_update.rol_id
        
    if OperacionRol_update.operacion_id is not None:
        operacionRol.operacion_id = OperacionRol_update.operacion_id
        
    
    db.commit()
    db.refresh(operacionRol)
    
    return {"message": "OperacionRol updated successfully", "OperacionRol": operacionRol}

def deleteOperacionRol(id: int, db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    operacionRol = db.query(RolOperacion).filter(RolOperacion.id == id).first()

    if operacionRol is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="OperacionRol not found")

    # Eliminar el usuario de la base de datos
    db.delete(operacionRol)
    db.commit()
    
    return {"message": "OperacionRol deleted successfully", "status": status.HTTP_200_OK}




