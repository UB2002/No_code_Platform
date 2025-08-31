from pydantic import BaseModel
from typing import Optional


class SaveWorkflow(BaseModel):
    name: str
    definition: dict
    owner: Optional[str] = None


class RunInlineRequest(BaseModel):
    workflow: dict
    query: str
