import fitz
from typing import List
import re


class PdfProcessor:
    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path
        self.doc = fitz.open(pdf_path)
    
    def close(self):
        self.doc.close()
    
    def extract_text(self) -> str:
        text = ""
        for page in self.doc:
            text += page.get_text()
        return text
    
    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        words = re.split(r'\s+', text)
        chunks = []
        i = 0
        while i < len(words):
            chunk_words = words[i:i+chunk_size]
            chunks.append(' '.join(chunk_words))
            i += chunk_size - overlap
        return chunks