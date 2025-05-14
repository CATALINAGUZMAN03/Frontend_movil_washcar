from datetime import date, time
from enum import Enum
from typing import Optional

from pydantic import BaseModel


# Enum para el estado de la orden
class EstadoEnum(str, Enum):
    pendiente = 'PENDIENTE'
    completado = 'COMPLETADO'
    cancelado = 'CANCELADO'


# Esquema para crear una nueva OrdenServicio
class OrdenServicioCreate(BaseModel):

    orden_id: Optional[int] = None
    cliente_id: Optional[int]
    vehiculo_id: Optional[str]
    servicio_id: Optional[int]
    empleado_admin_id: Optional[int]
    empleado_lavador_id: Optional[int]
    fecha_orden: Optional[date]
    hora_entrada: Optional[time]
    hora_salida: Optional[time] = None  # Hacemos hora_salida explícitamente opcional con valor predeterminado None
    estado: EstadoEnum
    total: Optional[float]
    diagnostico: Optional[str] = ""  # Valor predeterminado para diagnóstico

    class Config:
        orm_mode = True
        from_attributes = True


# Esquema para actualizar una OrdenServicio existente
class OrdenServicioUpdate(BaseModel):

    orden_id: Optional[int] = None
    cliente_id: Optional[int] = None
    vehiculo_id: Optional[str] = None
    servicio_id: Optional[int] = None
    empleado_admin_id: Optional[int] = None
    empleado_lavador_id: Optional[int] = None
    fecha_orden: Optional[date] = None
    hora_entrada: Optional[time] = None
    hora_salida: Optional[time] = None
    estado: Optional[EstadoEnum] = None
    total: Optional[float] = None
    diagnostico: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True


# Esquema para representar una OrdenServicio (respuesta de la API)
class OrdenServicio(BaseModel):
    orden_id: int
    cliente_id: int
    vehiculo_id: str
    servicio_id: int
    empleado_admin_id: int
    empleado_lavador_id: int
    fecha_orden: date
    hora_entrada: time
    hora_salida: Optional[time]
    estado: EstadoEnum
    total: float
    diagnostico: str

    class Config:
        orm_mode = True
        from_attributes = True