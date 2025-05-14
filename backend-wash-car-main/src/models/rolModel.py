from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from src.database.database import Base

# class Rol(Base):
#     __tablename__ = 'rol'
#     __table_args__ = {'extend_existing': True}
     
#     rol_id = Column(Integer, primary_key=True)
#     nombre = Column(String(50), unique=True, nullable=False)
 
class Rol(Base):
    __tablename__ = "rol"

    rol_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)

    empleados = relationship("Empleado", back_populates="rol")
    roles =  relationship("RolOperacion", back_populates="rol") 