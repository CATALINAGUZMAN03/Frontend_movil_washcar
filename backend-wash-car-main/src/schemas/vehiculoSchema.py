from typing import Optional

from pydantic import BaseModel


# Esquema base, que incluye todos los campos excepto el campo de clave primaria
class VehiculoBase(BaseModel):
    cliente_cedula: int
    marca: str
    modelo: str
    placa: str
    color: str
    tipo: str  # Tipo de vehículo, por ejemplo, sedán, SUV, etc.
    nombre: str
# Esquema para la creación de un vehículo (no incluye la clave primaria, ya que es generada automáticamente)
class VehiculoCreate(VehiculoBase):
    pass

# Esquema para la actualización de un vehículo (todos los campos son opcionales)
class VehiculoActualizar(BaseModel):
    cliente_cedula: Optional[int] = None
    marca: Optional[str] = None
    modelo: Optional[str] = None
    placa: Optional[str] = None
    color: Optional[str] = None
    tipo: Optional[str] = None
    nombre: Optional[str] = None

# Esquema que incluye el id del vehículo (para devolver datos completos)
class Vehiculo(VehiculoBase):
    vehiculo_id: Optional[int] = None  # Clave primaria generada automáticamente

    class Config:
        from_attributes = True  # Para que funcione con SQLAlchemy
