from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.models.moduloModel import Modulo
from src.schemas.moduloSchema import (Module, ModuloBase, ModuloCreate,
                                      ModuloUpdate)


# Crear un nuevo Modulo
def create_Modulo(modulo: ModuloCreate, db: Session):
    new_Modulo = Modulo(nombre=modulo.nombre)#, descripcion=Modulo.descripcion
    db.add(new_Modulo)
    db.commit()
    return {"message": "Modulo created successfully"}
 
# Obtener todos los Modulos
def get_Modulos(db: Session):
    modulos = db.query(Modulo).all()
    return {"message": f"{len(modulos)} Modulos found", "modulos": modulos}
 
# Obtener un Modulo por ID
def get_Modulo_by_id(modulo_id: int, db: Session):
    modulo = db.query(Modulo).filter(Modulo.id == modulo_id).first()
    if not modulo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Modulo not found")
    return {"message": "Modulo found", "Modulo": Module.from_orm(modulo)}

# Actualizar un Modulo por ID
def update_Modulo(modulo_id: int, Modulo_update: ModuloUpdate, db: Session):
    modulo = db.query(Modulo).filter(Modulo.id == modulo_id).first()
    if not modulo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Modulo not found")
    
    modulo.nombre = Modulo_update.nombre if Modulo_update.nombre is not None else modulo.nombre
    #Modulo.descripcion = Modulo_update.descripcion if Modulo_update.descripcion is not None else Modulo.descripcion
    
    db.commit()
    return {"message": "Modulo updated successfully"}

# Eliminar un Modulo por ID
def delete_Modulo(modulo_id: int, db: Session):
    modulo = db.query(Modulo).filter(Modulo.id == modulo_id).first()
    if not modulo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Modulo not found")
    
    db.delete(modulo)
    db.commit()
    return {"message": "Modulo deleted successfully"}
