from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker, declarative_base

url = "postgresql+psycopg2://postgres:2002@localhost:5432/ai_planet"


engine = create_engine(url, echo=True)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()  