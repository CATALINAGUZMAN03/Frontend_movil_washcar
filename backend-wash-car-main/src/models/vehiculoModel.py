

from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from src.database.database import Base


class Vehiculo(Base):
    __tablename__ = "vehiculo"

    vehiculo_id = Column(Integer, primary_key=True, index=True)
    #cliente_cedula = Column(Integer, ForeignKey("cliente.cliente_cedula"), nullable=False)
    cliente_cedula = Column(Integer,nullable=False)
    marca = Column(String(100), nullable=True)
    modelo = Column(String(100), nullable=True)
    placa = Column(String(10),  unique=True,  nullable=False)
    color = Column(String(50), nullable=False)
    tipo = Column(String(50), nullable=False)
    nombre =  Column(String(50), nullable=False)

    clientes = relationship("Cliente",
                           back_populates="vehiculos",
                           primaryjoin="Cliente.cliente_cedula == Vehiculo.cliente_cedula",
                           foreign_keys="[Vehiculo.cliente_cedula]"

                           )
    ordenes = relationship("OrdenServicio", back_populates="vehiculo")