from fastapi import Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from src.database.database import get_session
from src.helpers.auth_bearer import JWTBearer
from src.helpers.utils import get_current_user, get_hashed_password
from src.models.operacionModel import Operacion
from src.schemas.operacionSchema import OperacionActualizar, OperacionCreate


def registerOperacion(operacion: OperacionCreate, session: Session = Depends(get_session)):
    existingOperacion = session.query(Operacion).filter_by(id=operacion.id).first()
    if existingOperacion:
        raise HTTPException(status_code=400, detail="Operacion ya existe ")


    newOperacion = Operacion(nombre = operacion.nombre, modulo_id = operacion.modulo_id)
    #newOperacion = Operacion(**operacion.dict())

    session.add(newOperacion)
    session.commit()
    session.refresh(newOperacion)

    return {"message":"Operacion creada"}


def getOperacions(db: Session = Depends(get_session), current_user: Operacion = Depends(get_current_user)):
    operacions = db.query(Operacion).all()
    return operacions

def getOperacion(id: int, db: Session = Depends(get_session)):
#def getOperacion(Operacion_id: int, dependencies=[Depends(JWTBearer())], db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    
    operacion = db.query(Operacion).filter(Operacion.id == id).first()
    if operacion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Operacion not found")
    return operacion



def updateOperacion(id: int, Operacion_update: OperacionActualizar, db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    operacion = db.query(Operacion).filter(Operacion.id == id).first()

    if operacion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Operacion not found")

    # Actualizar la información del usuario solo si se proporciona un nuevo valor
    if Operacion_update.nombre is not None:
        operacion.nombre = Operacion_update.nombre
        

    db.commit()
    db.refresh(operacion)
    
    return {"message": "Operacion updated successfully", "Operacion": operacion}

def deleteOperacion(id: int, db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    operacion = db.query(Operacion).filter(Operacion.id == id).first()

    if operacion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Operacion not found")

    # Eliminar el usuario de la base de datos
    db.delete(operacion)
    db.commit()
    
    return {"message": "Operacion deleted successfully", "status": status.HTTP_200_OK}



