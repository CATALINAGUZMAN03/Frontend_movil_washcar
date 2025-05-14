from enum import Enum as PyEnum

from sqlalchemy import (Column, Date, Enum, ForeignKey, Integer, Numeric,
                        String, Text, Time)
from sqlalchemy.orm import relationship

from src.database.database import Base


# Definimos el enum para el estado
class EstadoEnum(PyEnum):
    PENDIENTE = "PENDIENTE"
    COMPLETADO = "COMPLETADO"
    CANCELADO = "CANCELADO"

class OrdenServicio(Base):
    __tablename__ = "orden_servicio"

    orden_id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("cliente.cliente_cedula"), nullable=False)
    vehiculo_id = Column(String, ForeignKey("vehiculo.placa"), nullable=False)
    servicio_id = Column(Integer, ForeignKey("servicio.servicio_id"), nullable=False)
    empleado_admin_id = Column(Integer, ForeignKey("empleado.empleado_id"), nullable=False)
    empleado_lavador_id = Column(Integer, ForeignKey("empleado.empleado_id"), nullable=False)
    fecha_orden = Column(Date, nullable=False)
    hora_entrada = Column(Time, nullable=False)
    hora_salida = Column(Time, nullable=True)
    estado = Column(Enum(EstadoEnum), nullable=False)
    total = Column(Numeric(precision=10, scale=2), nullable=False)
    diagnostico = Column(Text, nullable=True)

    # Relacionamos con las otras tablas
    cliente = relationship("Cliente", back_populates="ordenes")
    vehiculo = relationship("Vehiculo", back_populates="ordenes")
    servicio = relationship("Servicio", back_populates="ordenes")
    empleado_admin = relationship("Empleado", back_populates="ordenes_admin",foreign_keys=[empleado_admin_id])
    empleado_lavador = relationship("Empleado", back_populates="ordenes_lavador",foreign_keys=[empleado_lavador_id])
