from .chroma_client import get_or_create_collection
from .hf import embed_texts, generate_text
from typing import Dict, Any
import networkx as nx


def validate_workflow(data: Dict[str, Any]):

    nodes = {n["id"]: n for n in data.get("nodes", [])}
    types = {n["type"]: n for n in data.get("nodes", [])}

    if "UserQuery" not in types:
        raise ValueError("workflow must include a UserQuery node")

    if "Output" not in types:
        raise ValueError("workflow must include an Output node")

    G = nx.DiGraph()
    
    for n in data.get("nodes", []):
        G.add_node(n["id"])
    
    for e in data.get("edges", []):
        G.add_edge(e["source"], e["target"])

    if not nx.is_directed_acyclic_graph(G):
        raise ValueError("workflow must be a directed acyclic graph")

    return True


async def run_workflow(data: Dict[str, Any], user_query: str):
    nodes_by_id  = {n["id"]: n for n in data.get("nodes", [])}
    G = nx.DiGraph()
    
    for n in data.get("nodes", []):
        G.add_node(n["id"])

    for n in data.get("edges", []):
        G.add_edge(n["source"], n["target"])

    order = list(nx.topological_sort(G))
    
    context = {"query": user_query, "kb_docs": None, "llm_response": None}
    outputs = {}

    for node_id in order:
        node = nodes_by_id[node_id]
        ntype = node.get("type")
        if ntype == "UserQuery":
            outputs[node_id] = {"query": context["query"]}

        elif ntype == "KnowledgeBase":
            cfg = node.get("config", {}) or {}
            col_name = cfg.get("collectionName", "knowledge_base")
            # Ensure collection name meets ChromaDB requirements (3-512 chars, alphanumeric + ._-)
            if len(col_name) < 3:
                col_name = "knowledge_base"
            k = cfg.get("k", 5)
            collection = get_or_create_collection(col_name)

            try : 
                res = collection.query(
                    query_texts=[context["query"]],
                    n_results=k,
                    include=["documents", "metadatas", "distances"]
                )
                docs = res.get("documents", [[]])[0]
            except Exception as e:
                qres = collection.query(context["query"], n_results=k)
                docs = qres.get("documents", [[]])[0] if qres.get("documents") else []

            context["kb_docs"] = docs
            outputs[node_id] = {"kb_docs": docs}
        
        elif ntype == "LLMEngine":
            cfg = node.get("config", {}) or {}
            prompt_template = cfg.get("systemPrompt", "You are a helpful assistant. Answer the question based on the context provided.\n\nContext: {kb}\n\nQuestion: {query}")
            kb_text = "\n\n".join(context["kb_docs"]) if context.get("kb_docs") else "No context available."
            prompt = prompt_template.format(query=context["query"], kb=kb_text)
            model = cfg.get("model")

            resp = await generate_text(prompt, max_new_tokens=cfg.get("maxTokens", 256), model=model)
            context["llm_response"] = resp
            outputs[node_id] = {"llm_response": resp}
            
        elif ntype == "Output":
            outputs[node_id] = {"final_response": context.get("llm_response", "")}

        else:
            outputs[node_id] = {}

    for n in data.get("nodes", []):
        if n.get("type") == "Output":
            return outputs.get(n["id"], {}).get("final_response", "")
    return ""