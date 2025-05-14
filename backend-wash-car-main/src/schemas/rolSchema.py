import datetime
from typing import Optional

from pydantic import BaseModel


class RoleBase(BaseModel):
    rol_id: Optional[int] 
    nombre: str
    #descripcion: str
    class Config:
        from_attributes = True

class RoleCreate(RoleBase):
    #rol_id: Optional[int] 
    rol_id: int = None
    
    nombre: str

class RoleUpdate(RoleBase):
    #rol_id: Optional[int] = None
    rol_id: int = None
    nombre: str = None
    #descripcion: str = None

class Role(RoleBase):
    rol_id: Optional[int] 

    class Config:
        from_attributes = True