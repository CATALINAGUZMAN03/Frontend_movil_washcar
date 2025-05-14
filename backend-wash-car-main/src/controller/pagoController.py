from datetime import date, timedelta
from decimal import Decimal
from typing import Optional

from fastapi import Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

# Importa tu modelo de base de datos y la sesión de la base de datos
from src.database.database import get_session
from src.helpers.utils import get_current_user
from src.models.empleadoModel import Empleado
from src.models.ordenServicioModel import OrdenServicio


def getPagos(
    empleado_id: int, 
    fecha_inicio: str, 
    fecha_fin: str, 
    porcentaje: float,
    db: Session = Depends(get_session), 
    current_user: Empleado = Depends(get_current_user)
):
    # Consulta para sumar las ganancias de las órdenes del empleado en el rango de fechas
    resultado = db.execute(
        text("""
            SELECT 
                SUM(total) AS total_ordenes
            FROM 
                orden_servicio
            WHERE 
                empleado_lavador_id = :empleado_id
                AND fecha_orden BETWEEN :fecha_inicio AND :fecha_fin
        """),
        {"empleado_id": empleado_id, "fecha_inicio": fecha_inicio, "fecha_fin": fecha_fin}
    )
    
    # Extraer el valor de la suma de ganancias
    total_ordenes = resultado.scalar() or 0
    
    # Calcular las ganancias según el porcentaje
    ganancias = float(total_ordenes) * (porcentaje / 100)
    
    return ganancias
