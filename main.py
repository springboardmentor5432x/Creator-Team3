from fastapi import FastAPI
from pydantic import BaseModel
from passlib.context import CryptContext

app = FastAPI()
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


class UserRegister(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    role: str


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
def register(user: UserRegister):

    hashed_password = pwd_context.hash(user.password)

    return {
        "message": "User registered successfully",
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "hashed_password": hashed_password
    }