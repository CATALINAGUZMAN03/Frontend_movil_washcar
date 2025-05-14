from fastapi import Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from src.database.database import get_session
from src.helpers.auth_bearer import JWTBearer
from src.helpers.utils import get_current_user, get_hashed_password
from src.models.clienteModel import Cliente
from src.schemas.clienteSchema import ClienteActualizar, ClienteCreate


def registerCliente(cliente: ClienteCreate, session: Session = Depends(get_session)):
    existingCliente = session.query(Cliente).filter_by(cliente_cedula=cliente.cliente_cedula).first()
    if existingCliente:
        raise HTTPException(status_code=400, detail="Cliente ya existe ")


    #newCliente = Cliente(nombre = cliente.nombre, apellido = cliente.apellido, telefono = cliente.telefono, email = cliente.email, fecha_cumpleaños = cliente.fecha_cumpleaños, cedula = cliente.cedula)
    print(cliente)
    newCliente = Cliente(**cliente.dict())

    session.add(newCliente)
    session.commit()
    session.refresh(newCliente)

    return {"message":"Cliente creado", "cliente": newCliente}


def getClientes(db: Session = Depends(get_session), current_user: Cliente = Depends(get_current_user)):
    clientes = db.query(Cliente).all()
    return {"clientes":clientes}

def getCliente(cliente_cedula: int, db: Session = Depends(get_session)):
#def getCliente(Cliente_id: int, dependencies=[Depends(JWTBearer())], db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    
    cliente = db.query(Cliente).filter(Cliente.cedula == cliente_cedula).first()
    if cliente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente not found")
    return cliente



def updateCliente(cliente_cedula: int, Cliente_update: ClienteActualizar, db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    cliente = db.query(Cliente).filter(Cliente.cliente_cedula == cliente_cedula).first()

    if cliente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente not found")

    # Actualizar la información del usuario solo si se proporciona un nuevo valor
    if Cliente_update.nombre is not None:
        cliente.nombre = Cliente_update.nombre
    if Cliente_update.apellido is not None:
        cliente.apellido = Cliente_update.apellido
    if Cliente_update.email is not None:
        # Verificar si el nuevo email ya está registrado
        existing_Cliente = db.query(Cliente).filter(cliente.email == Cliente_update.email).first()
        if existing_Cliente and existing_Cliente.cliente_cedula != cliente_cedula:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        cliente.email = Cliente_update.email
    if Cliente_update.telefono is not None:
        cliente.telefono = Cliente_update.telefono
    
    if Cliente_update.fecha_cumpleaños is not None:
        cliente.fecha_cumpleaños = Cliente_update.fecha_cumpleaños
    if Cliente_update.cliente_cedula is not None:
        cliente.cliente_cedula = Cliente_update.cliente_cedula
    
    db.commit()
    db.refresh(cliente)
    
    return {"message": "Cliente updated successfully", "cliente": cliente}

def deleteCliente(cliente_cedula: int, db: Session = Depends(get_session)):
    # Buscar el usuario en la base de datos
    cliente = db.query(Cliente).filter(Cliente.cliente_cedula == cliente_cedula).first()

    if cliente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente not found")

    # Eliminar el usuario de la base de datos
    db.delete(cliente)
    db.commit()
    
    return {"message": "Cliente deleted successfully", "status": status.HTTP_200_OK, "cliente": cliente}








# def login(request: LoginRequest, db: Session = Depends(get_session)):
#     Cliente = db.query(Cliente).filter(Cliente.email == request.email).first()
#     if Cliente is None:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email")

#     if not verify_password(request.password, Cliente.password):
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Incorrect password"
#         )
#     # if user.primer_login:
#     #     # Responder con un mensaje de que se necesita cambiar la contraseña
#     #     return JSONResponse(
#     #         status_code=403,
#     #         content={
#     #             "message": "You need to change your password",
#     #             "change_password_required": True,
#     #             "access_token" : create_access_token(subject=user.id),
#     #             "refresh_token" : create_refresh_token(subject=user.id)
#     #         }
#     #     )
#     access_token = create_access_token(subject=Cliente.Cliente_id)
#     refresh_token = create_refresh_token(subject=Cliente.Cliente_id)
    
#     tokenDb = TokenTable(
#         user_id=Cliente.Cliente_id,
#         access_toke=access_token,
#         refresh_toke=refresh_token,
#         status=True
#     )
#     db.add(tokenDb)
#     db.commit()
#     db.refresh(tokenDb)

#     return {
#         "access_token": access_token,
#         "refresh_token": refresh_token,
#     }
