from fastapi import Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from src.database.database import get_session
from src.helpers.utils import (create_access_token, create_refresh_token,
                               get_current_user, get_hashed_password,
                               get_operations_by_role, verify_password)
from src.models.empleadoModel import Empleado, TokenTable
from src.schemas.empleadoSchema import EmpleadoActualizar, EmpleadoCreate
from src.schemas.schemas import LoginRequest


def registerEmpleado(empleado: EmpleadoCreate, session: Session = Depends(get_session)):
    existingEmpleado = session.query(Empleado).filter_by(email=empleado.email).first()
    if existingEmpleado:
        raise HTTPException(status_code=400, detail="Email already registered")
    existingEmpleado = session.query(Empleado).filter_by(cedula=empleado.cedula).first()
    if existingEmpleado:
        raise HTTPException(status_code=400, detail="Cedula ya registrada")

    encryptedPassword = get_hashed_password(empleado.password)

    newEmpleado = Empleado(nombre = empleado.nombre, apellido = empleado.apellido, telefono = empleado.telefono, email = empleado.email, password = encryptedPassword, rol_id = empleado.rol_id, cedula = empleado.cedula )
    #newEmpleado = Empleado(**empleado.dict())

    session.add(newEmpleado)
    session.commit()
    session.refresh(newEmpleado)


    return {"message":"Empleado created successfully", "nuevo":newEmpleado }

def login(request: LoginRequest, db: Session = Depends(get_session)):
    empleado = db.query(Empleado).filter(Empleado.email == request.email).first()
    if empleado is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email")

    if not verify_password(request.password, empleado.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password"
        )

    access_token = create_access_token(subject=empleado.empleado_id)
    refresh_token = create_refresh_token(subject=empleado.empleado_id)
    rol = empleado.rol_id
    operaciones = get_operations_by_role(rol, db)
    empleado_data = jsonable_encoder(empleado)

    # Eliminar tokens antiguos del usuario
    try:
        db.query(TokenTable).filter(TokenTable.user_id == empleado.empleado_id).delete()
        db.commit()
    except Exception as e:
        print(f"Error al eliminar tokens antiguos: {e}")
        db.rollback()

    # Crear nuevo token
    tokenDb = TokenTable(
        user_id=empleado.empleado_id,
        access_toke=access_token,
        refresh_toke=refresh_token,
        status=True
    )
    db.add(tokenDb)
    db.commit()
    db.refresh(tokenDb)

    return {
        "user": empleado_data,
        "operaciones": operaciones,
        "access_token": access_token,
        "refresh_token": refresh_token,


    }

def getEmpleados(db: Session = Depends(get_session), current_user: Empleado = Depends(get_current_user)):
    empleados = db.query(Empleado).all()
    return empleados

def getEmpleado(empleado_id: int, db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    empleado = db.query(Empleado).filter(Empleado.cedula == empleado_id).first()
    if empleado is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return empleado



def updateEmpleado(empleado_id: int, empleado_update: EmpleadoActualizar, db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    empleado = db.query(Empleado).filter(Empleado.cedula == empleado_id).first()

    if empleado is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empleado not found")

    # Actualizar la información del usuario solo si se proporciona un nuevo valor
    if empleado_update.nombre is not None:
        empleado.nombre = empleado_update.nombre
    if empleado_update.apellido is not None:
        empleado.apellido = empleado_update.apellido
    if empleado_update.telefono is not None:
        empleado.telefono = empleado_update.telefono
    if empleado_update.email is not None:
        # Verificar si el nuevo email ya está registrado
        existing_empleado = db.query(Empleado).filter(Empleado.email == empleado_update.email).first()
        if existing_empleado and existing_empleado.empleado_id != empleado_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        Empleado.email = empleado_update.email

    if empleado_update.password is not None:
        empleado.password = get_hashed_password(empleado_update.password)
    if empleado_update.rol_id is not None:
        empleado.rol_id = empleado_update.rol_id
    if empleado_update.cedula is not None:
        empleado.cedula = empleado_update.cedula


    db.commit()
    db.refresh(empleado)

    return {"message": "Empleado updated successfully", "empleado": empleado}

def deleteEmpleado(empleado_id: int, db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    empleado = db.query(Empleado).filter(Empleado.cedula == empleado_id).first()

    if empleado is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empleado not found")

    # Eliminar el usuario de la base de datos
    db.delete(empleado)
    db.commit()

    return {"message": "Empleado deleted successfully", "status": status.HTTP_200_OK}


# def changePassword(request: schemas.ChangePassword, db: Session = Depends(get_session)):
#     user = db.query(userModel.User).filter(userModel.User.email == request.email).first()
#     if user is None:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found")

#     if not verify_password(request.old_password, user.password):
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid old password")

#     encryptedPassword = get_hashed_password(request.new_password)
#     user.password = encryptedPassword
#     user.primer_login = False
#     db.commit()

#     return {"message": "Password changed successfully"}

#para primer login
 # if user.primer_login:
    #     # Responder con un mensaje de que se necesita cambiar la contraseña
    #     return JSONResponse(
    #         status_code=403,
    #         content={
    #             "message": "You need to change your password",
    #             "change_password_required": True,
    #             "access_token" : create_access_token(subject=user.id),
    #             "refresh_token" : create_refresh_token(subject=user.id)
    #         }
    #     )