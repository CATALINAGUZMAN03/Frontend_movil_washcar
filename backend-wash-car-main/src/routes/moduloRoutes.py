from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.controller.moduloController import (create_Modulo, delete_Modulo,
                                             get_Modulo_by_id, get_Modulos,
                                             update_Modulo)
from src.database.database import get_session
from src.models.empleadoModel import Empleado
from src.schemas.moduloSchema import Module, ModuloCreate, ModuloUpdate

MODULO_ROUTES = APIRouter()
 
@MODULO_ROUTES.post("/modulos", response_model=dict)
def create_Modulo_route(modulo: ModuloCreate, db: Session = Depends(get_session)):
    return create_Modulo(modulo, db)

@MODULO_ROUTES.get("/modulos/todos", response_model=dict)
def get_Modulos_route(db: Session = Depends(get_session)):
    modulos_data =get_Modulos(db)
    modulos = [Module.from_orm(modulo) for modulo in modulos_data["modulos"]]
    return {"message": modulos_data["message"], "modulos": modulos}
  
@MODULO_ROUTES.get("/modulos/{modulo_id}", response_model=dict)
def get_Modulo_by_id_route(modulo_id: int, db: Session = Depends(get_session)):
    return get_Modulo_by_id(modulo_id, db)

@MODULO_ROUTES.put("/modulos/actualizar/{modulo_id}", response_model=dict)
def update_Modulo_route(modulo_id: int, modulo: ModuloUpdate, db: Session = Depends(get_session)):
    return update_Modulo(modulo_id, modulo, db)

@MODULO_ROUTES.delete("/modulos/eliminar/{modulo_id}", response_model=dict)
def delete_Modulo_route(modulo_id: int, db: Session = Depends(get_session)):
    return delete_Modulo(modulo_id, db)
