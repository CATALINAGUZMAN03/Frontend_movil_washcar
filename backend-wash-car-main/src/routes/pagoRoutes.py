from datetime import date, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.controller.pagoController import getPagos
from src.database.database import get_session
from src.helpers.utils import get_current_user
from src.models.empleadoModel import Empleado

PAGOS_ROUTES = APIRouter()


@PAGOS_ROUTES.get("/pagos/{empleado_id}/ganancias")
async def calculate_earnings(
    empleado_id: int, 
    fecha_inicio: str, 
    fecha_fin: str, 
    porcentaje: float,
    db: Session = Depends(get_session), 
    current_empleado: Empleado = Depends(get_current_user)
):
    if(current_empleado.rol_id != 1):
        raise HTTPException(status_code=403, detail="No tienes permiso")
    # Llamada al controlador para calcular las ganancias
    ganancias = getPagos(empleado_id, fecha_inicio, fecha_fin, porcentaje, db)
    return {
        "empleado_id": empleado_id,
        "fecha_inicio": fecha_inicio,
        "fecha_fin": fecha_fin,
        "porcentaje": porcentaje,
        "ganancias": ganancias
    }
