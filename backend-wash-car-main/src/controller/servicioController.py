from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database.database import get_session
from src.models.servicioModel import Servicio
from src.schemas.servicioSchema import ServicioActualizar, ServicioCreate


def registerServicio(servicio: ServicioCreate, session: Session = Depends(get_session)):
    # Eliminamos la verificación de servicio_id ya que es autogenerado
    # Convertimos el modelo Pydantic a un diccionario y creamos una instancia del modelo SQLAlchemy
    try:
        # Para Pydantic v2
        servicio_data = servicio.model_dump(exclude_unset=True)
    except AttributeError:
        # Para Pydantic v1
        servicio_data = servicio.dict(exclude_unset=True)

    # Si servicio_id está presente, lo eliminamos para que la base de datos lo genere automáticamente
    if 'servicio_id' in servicio_data:
        del servicio_data['servicio_id']

    newServicio = Servicio(**servicio_data)

    session.add(newServicio)
    session.commit()
    session.refresh(newServicio)

    return {"message":"Servicio creado", "servicio": newServicio}


def getServicios(db: Session = Depends(get_session)):
    servicios = db.query(Servicio).all()
    return servicios

def getServicio(id: str, db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    servicio = db.query(Servicio).filter(Servicio.servicio_id == id).first()
    if servicio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio not found")
    return servicio



def updateServicio(id: int, Servicio_update: ServicioActualizar, db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    servicio = db.query(Servicio).filter(Servicio.servicio_id == id).first()

    if servicio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio not found")

    # Actualizar la información del usuario solo si se proporciona un nuevo valor
    if Servicio_update.nombre is not None:
        servicio.nombre = Servicio_update.nombre

    if Servicio_update.descripcion is not None:
        servicio.descripcion = Servicio_update.descripcion

    if Servicio_update.precio is not None:
        servicio.precio = Servicio_update.precio

    db.commit()
    db.refresh(servicio)

    return {"message": "Servicio updated successfully", "servicio": servicio}

def deleteServicio(id: int, db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    servicio = db.query(Servicio).filter(Servicio.servicio_id == id).first()

    if servicio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio not found")

    # Eliminar el usuario de la base de datos
    db.delete(servicio)
    db.commit()

    return {"message": "Servicio deleted successfully", "status": status.HTTP_200_OK}




