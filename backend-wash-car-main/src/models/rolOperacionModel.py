from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from src.database.database import Base


class RolOperacion(Base):
    __tablename__ = "rol_operacion"
 
    id = Column(Integer, primary_key=True, index=True)
    rol_id = Column(Integer,ForeignKey('rol.rol_id') ,nullable=False)
    operacion_id = Column(Integer, ForeignKey('operacion.id') ,nullable=False)

    rol = relationship("Rol", back_populates="roles")
    operacion = relationship("Operacion", back_populates="rol_operaciones")
 