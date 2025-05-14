from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from src.database.database import Base


class Modulo(Base):
    __tablename__ = "modulo"
 
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)

    operaciones = relationship("Operacion", back_populates="modulo")

