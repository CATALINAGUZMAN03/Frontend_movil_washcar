from typing import Optional

from pydantic import BaseModel, EmailStr


class EmpleadoCreate(BaseModel):
    nombre: Optional[str]
    apellido: Optional[str]
    telefono: Optional[str]
    email: EmailStr
    password: str
    rol_id: Optional[int]
    cedula: Optional[int]

class EmpleadoRead(BaseModel):
    empleado_id: int
    nombre: Optional[str]
    apellido: Optional[str]
    telefono: Optional[str]
    email: EmailStr
    rol_id: Optional[int]
    cedula: Optional[int]
    
class EmpleadoActualizar(BaseModel):
    #empleado_id: int
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    rol_id: Optional[int] = None
    cedula: Optional[int] = None
 
 
    class Config:
        from_attributes = True
