from config.db import Base
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(String, unique=True, nullable=False)
    filename = Column(String, nullable=False)
    upload_at = Column(DateTime, default=datetime.utcnow)
    doc_metadata = Column(Text, nullable=True)


class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner = Column(String, nullable=False)
    definition = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Chatlog(Base):
    __tablename__ = "chatlogs"

    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, nullable=False)
    user_query = Column(String, nullable=False)
    ai_response = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
