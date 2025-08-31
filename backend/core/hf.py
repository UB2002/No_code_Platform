from dotenv import load_dotenv
load_dotenv()
import os
import asyncio
from typing import List, Optional
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch

HF_TOKEN = os.getenv("HF_TOKEN")
EMBED_MODEL = os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
LLM_MODEL = os.getenv("LLM_MODEL", "microsoft/DialoGPT-medium")

# Global model instances (loaded once)
_embed_model = None
_llm_pipeline = None

def get_embed_model():
    global _embed_model
    if _embed_model is None:
        _embed_model = SentenceTransformer(EMBED_MODEL)
    return _embed_model

def get_llm_pipeline():
    global _llm_pipeline
    if _llm_pipeline is None:
        # Use a smaller, more reliable model for text generation
        _llm_pipeline = pipeline(
            "text-generation",
            model=LLM_MODEL,
            tokenizer=LLM_MODEL,
            device=0 if torch.cuda.is_available() else -1,
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
        )
    return _llm_pipeline

async def embed_texts(texts: List[str], model: Optional[str] = None) -> List[List[float]]:
    """Generate embeddings for a list of texts using sentence-transformers"""
    texts = [t for t in texts if isinstance(t, str) and t.strip()]
    
    if not texts:
        return []
    
    try:
        embed_model = get_embed_model()
        # Run in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        embeddings = await loop.run_in_executor(None, embed_model.encode, texts)
        return embeddings.tolist()
    except Exception as e:
        raise Exception(f"Embedding error: {str(e)}")

async def generate_text(prompt: str, max_new_tokens: int = 256, model: Optional[str] = None) -> str:
    """Generate text using transformers pipeline"""
    try:
        llm = get_llm_pipeline()
        loop = asyncio.get_event_loop()
        
        # Run generation in thread pool
        result = await loop.run_in_executor(
            None, 
            lambda: llm(
                prompt, 
                max_new_tokens=max_new_tokens, 
                do_sample=True, 
                temperature=0.7,
                pad_token_id=llm.tokenizer.eos_token_id
            )
        )
        
        if result and len(result) > 0:
            generated_text = result[0]['generated_text']
            # Remove the original prompt from the response
            if generated_text.startswith(prompt):
                generated_text = generated_text[len(prompt):].strip()
            return generated_text
        
        return "No response generated"
        
    except Exception as e:
        raise RuntimeError(f"Text generation error: {str(e)}")

# Test function
async def test():
    texts = ["Hello world", "FastAPI is great"]
    try:
        print("Testing embeddings...")
        embeddings = await embed_texts(texts)
        print("Embedding Success!")
        print("Embedding length:", len(embeddings))
        if embeddings and len(embeddings) > 0:
            print("Dimension:", len(embeddings[0]))
        
        print("\nTesting text generation...")
        response = await generate_text("Hello, how are you?", max_new_tokens=50)
        print("Generation Success!")
        print("Response:", response)
        
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(test())