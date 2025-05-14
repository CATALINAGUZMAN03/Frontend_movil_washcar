from typing import Optional

from pydantic import BaseModel


# Esquema base, que incluye todos los campos excepto el campo de clave primaria
class ServicioBase(BaseModel):
    servicio_id: Optional[int] = None
    nombre: str
    descripcion: str
    precio: int
    imagen_nombre: Optional[str] = "default.jpg"

# Esquema para la creación de un vehículo (no incluye la clave primaria, ya que es generada automáticamente)
class ServicioCreate(ServicioBase):
    pass

# Esquema para la actualización de un vehículo (todos los campos son opcionales)
class ServicioActualizar(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio: Optional[int] = None
    imagen_nombre: Optional[str] = None
# Esquema que incluye el id del vehículo (para devolver datos completos)
class Servicio(ServicioBase):
    servicio_id: Optional[int] = None  # Clave primaria generada automáticamente

    class Config:
        from_attributes = True  # Para que funcione con SQLAlchemy
