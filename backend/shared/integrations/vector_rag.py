"""
Vector Database RAG System - Pinecone for document embeddings and retrieval
"""
import os
from typing import Optional, Dict, Any, List


class PineconeRAGSystem:
    """
    Pinecone-based RAG (Retrieval Augmented Generation) system
    Store and retrieve document embeddings for agent knowledge
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        environment: Optional[str] = None,
        index_name: str = "agent-knowledge"
    ):
        """
        Initialize Pinecone RAG system

        Args:
            api_key: Pinecone API key
            environment: Pinecone environment
            index_name: Index name
        """
        self.api_key = api_key or os.getenv("PINECONE_API_KEY")
        self.environment = environment or os.getenv("PINECONE_ENVIRONMENT")
        self.index_name = index_name
        self.index = None
        self.embeddings = None

        if self.api_key:
            self._init_pinecone()

    def _init_pinecone(self):
        """Initialize Pinecone client"""
        try:
            from pinecone import Pinecone, ServerlessSpec

            pc = Pinecone(api_key=self.api_key)

            # Create index if it doesn't exist
            existing_indexes = [index.name for index in pc.list_indexes()]

            if self.index_name not in existing_indexes:
                pc.create_index(
                    name=self.index_name,
                    dimension=1536,  # OpenAI ada-002 dimension
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud="aws",
                        region="us-east-1"
                    )
                )

            self.index = pc.Index(self.index_name)

        except ImportError:
            raise ImportError("pinecone package required. Install with: pip install pinecone-client")

    def _init_embeddings(self):
        """Initialize embedding model"""
        try:
            from langchain_openai import OpenAIEmbeddings
            self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        except ImportError:
            raise ImportError("langchain-openai required")

    def add_documents(
        self,
        documents: List[str],
        metadatas: Optional[List[Dict[str, Any]]] = None,
        ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Add documents to vector store

        Args:
            documents: List of document texts
            metadatas: Optional metadata for each document
            ids: Optional IDs for documents

        Returns:
            Status dict
        """
        if not self.index:
            raise ValueError("Pinecone not initialized")

        if not self.embeddings:
            self._init_embeddings()

        # Generate embeddings
        vectors = self.embeddings.embed_documents(documents)

        # Prepare upsert data
        if not ids:
            import uuid
            ids = [str(uuid.uuid4()) for _ in documents]

        if not metadatas:
            metadatas = [{}] * len(documents)

        # Add text to metadata
        for i, doc in enumerate(documents):
            metadatas[i]["text"] = doc

        # Upsert to Pinecone
        upsert_data = [
            (ids[i], vectors[i], metadatas[i])
            for i in range(len(documents))
        ]

        self.index.upsert(vectors=upsert_data)

        return {
            "status": "success",
            "documents_added": len(documents),
            "ids": ids
        }

    def search(
        self,
        query: str,
        top_k: int = 5,
        filter: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Semantic search for relevant documents

        Args:
            query: Search query
            top_k: Number of results to return
            filter: Metadata filters

        Returns:
            List of relevant documents with scores
        """
        if not self.index:
            raise ValueError("Pinecone not initialized")

        if not self.embeddings:
            self._init_embeddings()

        # Generate query embedding
        query_vector = self.embeddings.embed_query(query)

        # Search Pinecone
        results = self.index.query(
            vector=query_vector,
            top_k=top_k,
            include_metadata=True,
            filter=filter
        )

        return [
            {
                "id": match.id,
                "score": match.score,
                "text": match.metadata.get("text", ""),
                "metadata": {k: v for k, v in match.metadata.items() if k != "text"}
            }
            for match in results.matches
        ]

    def delete_documents(self, ids: List[str]) -> Dict[str, str]:
        """Delete documents by IDs"""
        if not self.index:
            raise ValueError("Pinecone not initialized")

        self.index.delete(ids=ids)

        return {"status": "deleted", "count": len(ids)}

    def get_index_stats(self) -> Dict[str, Any]:
        """Get index statistics"""
        if not self.index:
            raise ValueError("Pinecone not initialized")

        stats = self.index.describe_index_stats()

        return {
            "total_vector_count": stats.total_vector_count,
            "dimension": stats.dimension,
            "index_fullness": stats.index_fullness
        }


class MockPineconeRAG:
    """Mock Pinecone RAG system"""

    def __init__(self, *args, **kwargs):
        self.documents = []

    def add_documents(self, documents: List[str], **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Pinecone add_documents: {len(documents)} documents")
        self.documents.extend(documents)
        return {
            "status": "success",
            "documents_added": len(documents),
            "ids": [f"mock_id_{i}" for i in range(len(documents))]
        }

    def search(self, query: str, top_k: int = 5, **kwargs) -> List[Dict[str, Any]]:
        print(f"[MOCK] Pinecone search: {query}")
        return [
            {
                "id": "mock_1",
                "score": 0.95,
                "text": "Mock relevant document 1",
                "metadata": {}
            },
            {
                "id": "mock_2",
                "score": 0.87,
                "text": "Mock relevant document 2",
                "metadata": {}
            }
        ]

    def delete_documents(self, ids: List[str]) -> Dict[str, str]:
        print(f"[MOCK] Pinecone delete_documents: {len(ids)} documents")
        return {"status": "deleted", "count": len(ids)}

    def get_index_stats(self) -> Dict[str, Any]:
        print("[MOCK] Pinecone get_index_stats")
        return {
            "total_vector_count": len(self.documents),
            "dimension": 1536,
            "index_fullness": 0.15
        }
