from fastapi import Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from src.database.database import get_session
from src.helpers.auth_bearer import JWTBearer
from src.helpers.utils import get_current_user, get_hashed_password
from src.models.vehiculoModel import Vehiculo
from src.schemas.vehiculoSchema import VehiculoActualizar, VehiculoCreate


def registerVehiculo(vehiculo: VehiculoCreate, session: Session = Depends(get_session)):
    existingVehiculo = session.query(Vehiculo).filter_by(placa=vehiculo.placa).first()
    if existingVehiculo:
        raise HTTPException(status_code=400, detail="Vehiculo ya existe ")


    # Convertimos el modelo Pydantic a un diccionario
    # Usamos model_dump() en lugar de dict() que está obsoleto
    vehiculo_data = vehiculo.model_dump() if hasattr(vehiculo, 'model_dump') else vehiculo.dict()
    newVehiculo = Vehiculo(**vehiculo_data)

    session.add(newVehiculo)
    session.commit()
    session.refresh(newVehiculo)

    return {"message":"Vehiculo creado", "vehiculo": newVehiculo}


def getVehiculos(db: Session = Depends(get_session)):
    try:
        vehiculos = db.query(Vehiculo).all()
        return vehiculos
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al obtener vehículos: {str(e)}")

def getVehiculo(placa: str, db: Session = Depends(get_session)):
#def getVehiculo(Vehiculo_id: int, dependencies=[Depends(JWTBearer())], db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos

    vehiculo = db.query(Vehiculo).filter(Vehiculo.placa == placa).first()
    if vehiculo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehiculo not found")
    return vehiculo



def updateVehiculo(placa: str, Vehiculo_update: VehiculoActualizar, db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    vehiculo = db.query(Vehiculo).filter(Vehiculo.placa == placa).first()

    if vehiculo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehiculo not found")

    # Actualizar la información del usuario solo si se proporciona un nuevo valor
    if Vehiculo_update.cliente_cedula is not None:
        vehiculo.cliente_cedula = Vehiculo_update.cliente_cedula
    if Vehiculo_update.marca is not None:
        vehiculo.marca = Vehiculo_update.marca
    if Vehiculo_update.modelo is not None:
        vehiculo.modelo = Vehiculo_update.modelo
    # if Vehiculo_update.placa is not None:
    #     # Verificar si la nueva placa ya está registrado
    #     existing_Vehiculo = db.query(Vehiculo).filter(Vehiculo.placa == Vehiculo_update.placa).first()
    #     if existing_Vehiculo:
    #         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Placa already registered")
    #     vehiculo.placa = Vehiculo_update.placa
    if Vehiculo_update.placa is not None:
        vehiculo.placa = Vehiculo_update.placa

    if Vehiculo_update.color is not None:
        vehiculo.color = Vehiculo_update.color
    if Vehiculo_update.tipo is not None:
        vehiculo.tipo = Vehiculo_update.tipo
    if Vehiculo_update.nombre is not None:
        vehiculo.nombre = Vehiculo_update.nombre
    db.commit()
    db.refresh(vehiculo)

    return {"message": "Vehiculo updated successfully", "Vehiculo": vehiculo}

def deleteVehiculo(placa: str, db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    vehiculo = db.query(Vehiculo).filter(Vehiculo.placa == placa).first()

    if vehiculo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehiculo not found")

    # Eliminar el usuario de la base de datos
    db.delete(vehiculo)
    db.commit()

    return {"message": "Vehiculo deleted successfully", "status": status.HTTP_200_OK}




