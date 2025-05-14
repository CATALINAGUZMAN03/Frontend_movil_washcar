from typing import Optional

from pydantic import BaseModel


class ModuloBase(BaseModel):
    id: Optional[int] = None
    nombre: str
    
    class Config:
        from_attributes = True

class ModuloCreate(ModuloBase):
    pass
class ModuloUpdate(ModuloBase):
    #rol_id: Optional[int] = None
    id: Optional[int] = None
    nombre:Optional[str] = None
 
 
class Module(ModuloBase):
    id: Optional[int]  = None

    class Config:
        from_attributes = True