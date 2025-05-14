

from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from src.database.database import Base


class Cliente(Base):
    __tablename__ = "cliente"

    cliente_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=True)
    apellido = Column(String(100), nullable=True)
    telefono = Column(String(15), nullable=True)
    email = Column(String(100), unique=True, nullable=False)
    fecha_cumpleaños = Column(Date)
    cliente_cedula = Column(Integer, unique=True, nullable=False)

    vehiculos = relationship("Vehiculo",back_populates="clientes",
                             primaryjoin="Cliente.cliente_cedula == Vehiculo.cliente_cedula",
                             foreign_keys="[Vehiculo.cliente_cedula]")
    ordenes = relationship("OrdenServicio", back_populates="cliente")