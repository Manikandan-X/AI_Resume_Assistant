from pydantic import BaseModel
from pydantic import EmailStr

from datetime import datetime
from app.enums.user_role import UserRole


class UserCreate(BaseModel):

    full_name: str

    email: EmailStr

    password: str

    role: UserRole


class UserLogin(BaseModel):

    email: EmailStr

    password: str


class UserResponse(BaseModel):

    id: int

    full_name: str

    email: EmailStr

    role: UserRole

    created_at: datetime
    
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }
    
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str