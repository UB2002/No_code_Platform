import uuid
import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from auth.auth import get_current_user
from typing import Optional
from core.extractor import PdfProcessor
from core.hf import embed_texts
from core.chroma_client import get_or_create_collection
from core.workflow import validate_workflow, run_workflow
from models.llm import Document, Workflow
from sqlalchemy.orm import Session
from config.db import get_db
from schema.workflow import SaveWorkflow, RunInlineRequest

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploaded_docs")
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter()


@router.post("/upload-doc")
async def upload_doc(file: UploadFile = File(...), metadata: Optional[str]="", db: Session = Depends(get_db)):
    file_id = str(uuid.uuid4())
    filename = f"{file_id}_{file.filename}"
    save_path = os.path.join(UPLOAD_DIR, filename)
    with open(save_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    process = PdfProcessor(save_path)
    try:
        text = process.extract_text()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    chunks = process.chunk_text(text, chunk_size=500, overlap=50)
    embeddings = await embed_texts(chunks)
    
    col = get_or_create_collection(name="knowledge_base")
    ids = [f"{file_id}_{i}" for i in range(len(chunks))]
    metadatas = [{"source": file.filename, "chunk_index": i} for i in range(len(chunks))]
    col.add(ids=ids, embeddings=embeddings, metadatas=metadatas, documents=chunks)


    doc = Document(file_id=file_id, filename=file.filename, doc_metadata=metadata)
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {"file_id": file_id, "filename": file.filename, "chunks": len(chunks)}


@router.post("/saveWorkflow")
def save_workflow(req: SaveWorkflow, db: Session = Depends(get_db)):
    try: 
        validate_workflow(req.definition)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Convert definition dict to JSON string for database storage
    import json
    definition_json = json.dumps(req.definition)
    
    wf = Workflow(name=req.name, owner=req.owner, definition=definition_json)

    db.add(wf)
    db.commit()
    db.refresh(wf)

    return {"workflow_id": wf.id, "message": "Workflow saved successfully"}


@router.get("/workflows")
def get_workflows(db: Session = Depends(get_db)):
    import json
    workflows = db.query(Workflow).all()
    
    # Convert JSON strings back to dictionaries for frontend
    result = []
    for wf in workflows:
        workflow_dict = {
            "id": wf.id,
            "name": wf.name,
            "owner": wf.owner,
            "created_at": wf.created_at,
            "definition": json.loads(wf.definition) if isinstance(wf.definition, str) else wf.definition
        }
        result.append(workflow_dict)
    
    return result

@router.post("/run-workflow-inline")
async def run_workflow_inline(body: RunInlineRequest, db: Session = Depends(get_db)):
    try:
        validate_workflow(body.workflow)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    ans = await run_workflow(body.workflow, body.query)

    return {"answer": ans}


@router.delete("/workflows/{workflow_id}")
def delete_workflow(workflow_id: int, db: Session = Depends(get_db)):
    wf = db.get(Workflow, workflow_id)
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    db.delete(wf)
    db.commit()
    
    return {"message": "Workflow deleted successfully"}


@router.post("/workflows/{workflow_id}/run")
async def run_workflow_by_id(workflow_id: int, payload: dict, db: Session= Depends(get_db)):
    query = payload.get("query")

    if not query:
        raise HTTPException(status_code=400, detail="Query is required")
    
    wf = db.get(Workflow, workflow_id)
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Parse JSON string back to dictionary
    import json
    definition = json.loads(wf.definition) if isinstance(wf.definition, str) else wf.definition

    ans = await run_workflow(definition, query)
    
    return {"answer": ans}

