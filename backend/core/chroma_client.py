import chromadb
import os 
from dotenv import load_dotenv
load_dotenv()


CHROMA_DIR = os.getenv("CHROMA_DIR", "chroma_db")
__client = chromadb.PersistentClient(path=CHROMA_DIR)

def get_or_create_collection(name: str = "knowledge_base"):
    try : 
        return __client.get_collection(name=name)
    except :
        return __client.create_collection(name=name)


if __name__ == "__main__":

    collection = get_or_create_collection()
    print(collection.count())
    print(collection.get())
    print(collection.peek())