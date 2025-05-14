from sqlalchemy import (Boolean, Column, Date, ForeignKey, Integer, Numeric,
                        String, Text)
from sqlalchemy.orm import relationship

from src.database.database import Base


class Operacion(Base):
    __tablename__ = "operacion"
     
    id = Column(Integer, primary_key=True, index=True)
    nombre =  Column(String(100), nullable=False)
    modulo_id = Column(Integer, ForeignKey("modulo.id"), nullable=False)
    
    modulo = relationship("Modulo", back_populates="operaciones")
    rol_operaciones = relationship("RolOperacion", back_populates="operacion")
 