from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import User

app = FastAPI()
Base.metadata.create_all(bind=engine)
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)
SECRET_KEY = "creatoriq_secret_key"
ALGORITHM = "HS256"
security = HTTPBearer()


class UserRegister(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    role: str
class UserLogin(BaseModel):
    email: str
    password: str


@app.get("/")
def home():
    return {"message": "Welcome to CreatorIQ Backend"}


@app.get("/about")
def about():
    return {"message": "This is CreatorIQ Backend API"}


@app.get("/contact")
def contact():
    return {
        "email": "creatoriq@gmail.com",
        "phone": "9876543210"
    }


@app.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):

    hashed_password = pwd_context.hash(user.password)

    db_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hashed_password,
        role=user.role
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {
        "message": "User registered successfully"
    }
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    stored_user = db.query(User).filter(User.email == user.email).first()

    if stored_user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not pwd_context.verify(user.password, stored_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = jwt.encode(
        {
            "email": stored_user.email,
            "role": stored_user.role
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
@app.get("/user")
def get_user(credentials: HTTPAuthorizationCredentials = Depends(security)):

    token = credentials.credentials

    print("Received Token:", token)

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        print("Payload:", payload)

        return {
            "message": "Authorized User",
            "user": payload
        }

    except JWTError as e:
        print("JWT Error:", repr(e))
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )