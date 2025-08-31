

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import userRoute as user
from routes import llmRoute as llm
from config.db import engine, Base


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

Base.metadata.create_all(engine)


app.include_router(user.router, prefix="/api", tags=["user"])
app.include_router(llm.router, prefix="/api", tags=["llm"])


@app.post("/")
def index():
    return "<h1>Hello World</h1>"


