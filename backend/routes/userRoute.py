from config.db import get_db
from schema.user import UserCreate, LoginRequest
from models.user import Users
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth.auth import get_password_hash, create_access_token, authenticate_user
from datetime import timedelta


router = APIRouter()


@router.post('/register')
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    user.password = get_password_hash(user.password)
    db_user = Users(
        **user.dict()
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post('/login')
async def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, data.username, data.password)
    if not user:
        raise HTTPException(status_code=400, detail='Incorrect username or password')
    
    access_token = create_access_token(data={'username':user.username}, expires_delta=timedelta(30))
    return {"access_token":access_token, "token_type": "bearer"}