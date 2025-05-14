from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database.database import get_session
from src.helpers.utils import get_current_user
from src.models.clienteModel import Cliente
from src.models.ordenServicioModel import OrdenServicio
from src.schemas.ordenServicioSchema import (OrdenServicioCreate,
                                             OrdenServicioUpdate)


def registerOrdenServicio(orden_servicio: OrdenServicioCreate, session: Session = Depends(get_session)):
    existing_orden = session.query(OrdenServicio).filter_by(orden_id=orden_servicio.orden_id).first()
    if existing_orden:
        raise HTTPException(status_code=400, detail="Orden de servicio ya existe")
    cliente = session.query(Cliente).filter(Cliente.cliente_cedula == orden_servicio.cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    # Crear nueva orden de servicio con los datos recibidos
    try:
        # Para Pydantic v2
        orden_data = orden_servicio.model_dump()
    except AttributeError:
        # Para Pydantic v1
        orden_data = orden_servicio.dict()

    # Asegurarnos de que hora_salida tenga un valor si es None
    if orden_data.get('hora_salida') is None:
        # Si hora_entrada está presente, establecemos hora_salida como 1 hora después
        if orden_data.get('hora_entrada'):
            from datetime import datetime, timedelta
            try:
                # Convertir hora_entrada a datetime
                hora_entrada_str = str(orden_data['hora_entrada'])
                hora_entrada_dt = datetime.strptime(hora_entrada_str, "%H:%M:%S")

                # Agregar 1 hora
                hora_salida_dt = hora_entrada_dt + timedelta(hours=1)

                # Convertir de nuevo a time
                from datetime import time
                orden_data['hora_salida'] = time(
                    hour=hora_salida_dt.hour,
                    minute=hora_salida_dt.minute,
                    second=hora_salida_dt.second
                )
            except Exception as e:
                print(f"Error al calcular hora_salida: {e}")
                # Si hay un error, simplemente usamos la misma hora de entrada
                orden_data['hora_salida'] = orden_data['hora_entrada']

    new_orden_servicio = OrdenServicio(**orden_data)

    session.add(new_orden_servicio)
    session.commit()
    session.refresh(new_orden_servicio)

    return {"message": "Orden de servicio creada con éxito", "orden_servicio": new_orden_servicio}


def getOrdenesServicio(db: Session = Depends(get_session), current_user: dict = Depends(get_current_user), estado: str = None):
    # Si se proporciona un estado, filtrar por ese estado
    if estado:
        print(f"Filtrando órdenes por estado: {estado}")
        ordenes_servicio = db.query(OrdenServicio).filter(OrdenServicio.estado == estado).all()
    else:
        print("Obteniendo todas las órdenes")
        ordenes_servicio = db.query(OrdenServicio).all()

    return ordenes_servicio


def getOrdenServicio(orden_id: int, db: Session = Depends(get_session)):
    # Buscar la orden de servicio en la base de datos
    orden_servicio = db.query(OrdenServicio).filter(OrdenServicio.orden_id == orden_id).first()

    if orden_servicio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Orden de servicio no encontrada")

    # Obtener datos del cliente
    cliente = db.query(Cliente).filter(Cliente.cliente_cedula == orden_servicio.cliente_id).first()

    # Obtener datos del vehículo
    from src.models.vehiculoModel import Vehiculo
    vehiculo = db.query(Vehiculo).filter(Vehiculo.placa == orden_servicio.vehiculo_id).first()

    # Obtener datos del servicio
    from src.models.servicioModel import Servicio
    servicio = db.query(Servicio).filter(Servicio.servicio_id == orden_servicio.servicio_id).first()

    # Obtener datos de los empleados
    from src.models.empleadoModel import Empleado
    empleado_admin = db.query(Empleado).filter(Empleado.empleado_id == orden_servicio.empleado_admin_id).first()
    empleado_lavador = db.query(Empleado).filter(Empleado.empleado_id == orden_servicio.empleado_lavador_id).first()

    print(f"Orden ID: {orden_id}")
    print(f"Vehículo: {vehiculo.placa if vehiculo else 'No encontrado'}")
    print(f"Servicio: {servicio.nombre if servicio else 'No encontrado'}")
    print(f"Total: {orden_servicio.total}")

    return {
        "orden_servicio": orden_servicio,
        "cliente": {
            "nombre": cliente.nombre if cliente else "No encontrado",
            "telefono": cliente.telefono if cliente else "No encontrado"
        },
        "vehiculo": {
            "placa": vehiculo.placa if vehiculo else "No encontrado",
            "marca": vehiculo.marca if vehiculo else "No encontrado",
            "modelo": vehiculo.modelo if vehiculo else "No encontrado",
            "color": vehiculo.color if vehiculo else "No encontrado",
            "tipo": vehiculo.tipo if vehiculo else "No encontrado"
        },
        "servicio": {
            "nombre": servicio.nombre if servicio else "No encontrado",
            "descripcion": servicio.descripcion if servicio else "No encontrado",
            "precio": servicio.precio if servicio else 0
        },
        "empleados": {
            "admin": {
                "nombre": empleado_admin.nombre if empleado_admin else "No encontrado",
                "apellido": empleado_admin.apellido if empleado_admin else "No encontrado"
            },
            "lavador": {
                "nombre": empleado_lavador.nombre if empleado_lavador else "No encontrado",
                "apellido": empleado_lavador.apellido if empleado_lavador else "No encontrado"
            }
        }
    }


def updateOrdenServicio(orden_id: int, orden_servicio_update: OrdenServicioUpdate, db: Session = Depends(get_session)):
    # Buscar la orden de servicio en la base de datos
    orden_servicio = db.query(OrdenServicio).filter(OrdenServicio.orden_id == orden_id).first()

    if orden_servicio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Orden de servicio no encontrada")

    # Actualizar solo los campos que se proporcionen
    try:
        # Para Pydantic v2
        update_data = orden_servicio_update.model_dump(exclude_unset=True)
    except AttributeError:
        # Para Pydantic v1
        update_data = orden_servicio_update.dict(exclude_unset=True)

    print(f"Datos de actualización recibidos para orden {orden_id}: {update_data}")
    print(f"Estado actual de la orden: {orden_servicio.estado}")

    # Verificar si se está actualizando el estado
    if 'estado' in update_data:
        print(f"Actualizando estado de orden {orden_id} de {orden_servicio.estado} a {update_data['estado']}")

    for key, value in update_data.items():
        if value is not None:  # Solo actualizar si el valor no es None
            print(f"Actualizando campo {key} de {getattr(orden_servicio, key, 'None')} a {value}")
            setattr(orden_servicio, key, value)

    db.commit()
    db.refresh(orden_servicio)

    print(f"Orden {orden_id} actualizada. Nuevo estado: {orden_servicio.estado}")

    return {"message": "Orden de servicio actualizada con éxito", "orden_servicio": orden_servicio}


def deleteOrdenServicio(orden_id: int, db: Session = Depends(get_session)):
    # Buscar la orden de servicio en la base de datos
    orden_servicio = db.query(OrdenServicio).filter(OrdenServicio.orden_id == orden_id).first()

    if orden_servicio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Orden de servicio no encontrada")

    # Eliminar la orden de servicio
    db.delete(orden_servicio)
    db.commit()

    return {"message": "Orden de servicio eliminada con éxito", "status": status.HTTP_200_OK}
