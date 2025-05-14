from typing import Optional

from pydantic import BaseModel


# Esquema base, que incluye todos los campos excepto el campo de clave primaria
class OperacionBase(BaseModel):
    id: Optional[int] = None
    nombre: str
    modulo_id: int
   
# Esquema para la creación de un vehículo (no incluye la clave primaria, ya que es generada automáticamente)
class OperacionCreate(OperacionBase):
    pass

# Esquema para la actualización de un vehículo (todos los campos son opcionales)
class OperacionActualizar(BaseModel):
    nombre: Optional[str] = None
    
    
# Esquema que incluye el id del vehículo (para devolver datos completos)
class Operacion(OperacionBase):
    id: Optional[int] = None  # Clave primaria generada automáticamente

    class Config:
        from_attributes = True # Para que funcione con SQLAlchemy
