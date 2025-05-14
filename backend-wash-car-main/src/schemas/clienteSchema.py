from datetime import date
from typing import Optional

from pydantic import BaseModel, EmailStr


class ClienteCreate(BaseModel):
    nombre: Optional[str]
    apellido: Optional[str]
    telefono: Optional[str]
    email: EmailStr
    fecha_cumpleaños: Optional[date]
    cliente_cedula: Optional[int]
    
    
class ClienteRead(BaseModel):
    cliente_id: int
    nombre: Optional[str]
    apellido: Optional[str]
    telefono: Optional[str]
    email: EmailStr
    fecha_cumpleaños: Optional[date]
    cliente_cedula: Optional[int]
    
class ClienteActualizar(BaseModel):
    #Cliente_id: int
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    fecha_cumpleaños: Optional[date] = None
    cliente_cedula: Optional[int] = None
    
 
    class Config:
        from_attributes = True
