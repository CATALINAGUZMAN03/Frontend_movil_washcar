from typing import Optional

from pydantic import BaseModel


# Esquema base, que incluye todos los campos excepto el campo de clave primaria
class OperacionRolBase(BaseModel):
    id: Optional[int] = None
    rol_id: int
    operacion_id: int

# Esquema para la creación de un vehículo (no incluye la clave primaria, ya que es generada automáticamente)
class OperacionRolCreate(OperacionRolBase):
    pass

# Esquema para la actualización de un vehículo (todos los campos son opcionales)
class OperacionRolActualizar(BaseModel):
    rol_id: Optional[int] = None
    operacion_id: Optional[int] = None
    
# Esquema que incluye el id del vehículo (para devolver datos completos)
class OperacionRol(OperacionRolBase):
    id: Optional[int] = None  # Clave primaria generada automáticamente

    class Config:
        from_attributes = True # Para que funcione con SQLAlchemy
