from sqlalchemy import (Boolean, Column, Date, ForeignKey, Integer, Numeric,
                        String, Text)
from sqlalchemy.orm import relationship

from src.database.database import Base


class Servicio(Base):
    __tablename__ = "servicio"
     
    servicio_id = Column(Integer, primary_key=True, index=True)
    nombre =  Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    precio = Column(Numeric(precision=10, scale=2))
    imagen_nombre = Column(Text, nullable=True)
    
    ordenes = relationship("OrdenServicio", back_populates="servicio")
