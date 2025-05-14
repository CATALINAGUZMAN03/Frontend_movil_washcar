import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from src.database.database import Base


class Empleado(Base):
    __tablename__ = "empleado"
     
    empleado_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=True)
    apellido = Column(String(100), nullable=True)
    telefono = Column(String(15), nullable=True)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    rol_id = Column(Integer, ForeignKey("rol.rol_id"), nullable=True)
    cedula = Column(Integer, unique=True, nullable=False)

    # Relación con la tabla Rol (asumiendo que tienes un modelo de 'Rol' creado)
    rol = relationship("Rol", back_populates="empleados")
    ordenes_admin = relationship("OrdenServicio", foreign_keys="[OrdenServicio.empleado_admin_id]", back_populates="empleado_admin")
    ordenes_lavador = relationship("OrdenServicio", foreign_keys="[OrdenServicio.empleado_lavador_id]", back_populates="empleado_lavador")

class TokenTable(Base):
    __tablename__ = "token"
    user_id = Column(Integer)
    access_toke = Column(String(450), primary_key=True)
    refresh_toke = Column(String(450),nullable=False)
    status = Column(Boolean)
    created_date = Column(DateTime, default=datetime.datetime.now)
    
# class Rol(Base):
#     __tablename__ = "rol"

#     rol_id = Column(Integer, primary_key=True, index=True)
#     nombre = Column(String(100), nullable=False)

#     empleados = relationship("Empleado", back_populates="rol")
