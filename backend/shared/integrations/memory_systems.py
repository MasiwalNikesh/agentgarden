"""
Agent Memory Systems - Persistent memory across conversations
Integrates Mem0 and Zep for long-term agent memory
"""
import os
from typing import Optional, Dict, Any, List
from datetime import datetime


class Mem0MemorySystem:
    """
    Mem0 memory layer for persistent agent memory
    Automatically extracts and stores relevant information
    """

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Mem0 memory system

        Args:
            api_key: Mem0 API key
        """
        self.api_key = api_key or os.getenv("MEM0_API_KEY")
        self.client = None

        if self.api_key:
            self._init_client()

    def _init_client(self):
        """Initialize Mem0 client"""
        try:
            from mem0 import Memory
            self.client = Memory(api_key=self.api_key)
        except ImportError:
            raise ImportError("mem0ai package required. Install with: pip install mem0ai")

    def add_memory(
        self,
        text: str,
        user_id: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Add memory from conversation text

        Args:
            text: Conversation text to extract memory from
            user_id: User identifier
            metadata: Additional metadata

        Returns:
            Memory extraction result
        """
        if not self.client:
            raise ValueError("Mem0 client not initialized")

        result = self.client.add(
            text,
            user_id=user_id,
            metadata=metadata or {}
        )

        return {
            "memory_id": result.get("id"),
            "extracted_memories": result.get("memories", []),
            "status": "added"
        }

    def search_memory(
        self,
        query: str,
        user_id: str,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Search memories by query

        Args:
            query: Search query
            user_id: User identifier
            limit: Max number of results

        Returns:
            List of relevant memories
        """
        if not self.client:
            raise ValueError("Mem0 client not initialized")

        results = self.client.search(
            query,
            user_id=user_id,
            limit=limit
        )

        return [
            {
                "memory": r.get("memory"),
                "score": r.get("score"),
                "metadata": r.get("metadata")
            }
            for r in results
        ]

    def get_all_memories(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all memories for a user"""
        if not self.client:
            raise ValueError("Mem0 client not initialized")

        memories = self.client.get_all(user_id=user_id)

        return [
            {
                "id": m.get("id"),
                "memory": m.get("memory"),
                "created_at": m.get("created_at")
            }
            for m in memories
        ]

    def delete_memory(self, memory_id: str) -> Dict[str, str]:
        """Delete a specific memory"""
        if not self.client:
            raise ValueError("Mem0 client not initialized")

        self.client.delete(memory_id)
        return {"status": "deleted", "memory_id": memory_id}


class ZepMemorySystem:
    """
    Zep memory system for long-term conversation memory
    Automatic summarization and fact extraction
    """

    def __init__(self, api_url: Optional[str] = None, api_key: Optional[str] = None):
        """
        Initialize Zep memory system

        Args:
            api_url: Zep server URL
            api_key: Zep API key
        """
        self.api_url = api_url or os.getenv("ZEP_API_URL")
        self.api_key = api_key or os.getenv("ZEP_API_KEY")
        self.client = None

        if self.api_url:
            self._init_client()

    def _init_client(self):
        """Initialize Zep client"""
        try:
            from zep_python import ZepClient
            self.client = ZepClient(
                base_url=self.api_url,
                api_key=self.api_key
            )
        except ImportError:
            raise ImportError("zep-python package required. Install with: pip install zep-python")

    def create_session(self, session_id: str, user_id: str) -> Dict[str, Any]:
        """Create a memory session"""
        if not self.client:
            raise ValueError("Zep client not initialized")

        from zep_python.models import Session

        session = Session(
            session_id=session_id,
            user_id=user_id
        )

        self.client.memory.add_session(session)

        return {"session_id": session_id, "user_id": user_id, "status": "created"}

    def add_message(
        self,
        session_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, str]:
        """
        Add message to session memory

        Args:
            session_id: Session identifier
            role: Message role ("user" or "assistant")
            content: Message content
            metadata: Additional metadata

        Returns:
            Status dict
        """
        if not self.client:
            raise ValueError("Zep client not initialized")

        from zep_python.models import Message

        message = Message(
            role=role,
            content=content,
            metadata=metadata or {}
        )

        self.client.memory.add_memory(session_id, message)

        return {"status": "added", "session_id": session_id}

    def get_memory(self, session_id: str) -> Dict[str, Any]:
        """
        Get memory for a session

        Returns conversation history, summary, and extracted facts
        """
        if not self.client:
            raise ValueError("Zep client not initialized")

        memory = self.client.memory.get_memory(session_id)

        return {
            "session_id": session_id,
            "messages": [
                {"role": m.role, "content": m.content}
                for m in memory.messages or []
            ],
            "summary": memory.summary.content if memory.summary else None,
            "facts": memory.facts or []
        }

    def search_memory(
        self,
        session_id: str,
        query: str,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """Search session memory"""
        if not self.client:
            raise ValueError("Zep client not initialized")

        from zep_python.models import MemorySearchPayload

        search_payload = MemorySearchPayload(
            text=query,
            search_scope="messages"
        )

        results = self.client.memory.search_memory(session_id, search_payload, limit=limit)

        return [
            {
                "content": r.message.content,
                "score": r.score,
                "metadata": r.message.metadata
            }
            for r in results
        ]


class MockMemorySystem:
    """Mock memory system for testing"""

    def __init__(self, *args, **kwargs):
        self.memories = {}

    def add_memory(self, text: str, user_id: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Memory add_memory for user {user_id}")
        memory_id = f"mem_{len(self.memories)}"
        self.memories[memory_id] = {"text": text, "user_id": user_id}
        return {"memory_id": memory_id, "extracted_memories": [text], "status": "added"}

    def search_memory(self, query: str, user_id: str, **kwargs) -> List[Dict[str, Any]]:
        print(f"[MOCK] Memory search_memory: {query}")
        return [{"memory": "Mock memory result", "score": 0.95, "metadata": {}}]

    def get_all_memories(self, user_id: str) -> List[Dict[str, Any]]:
        print(f"[MOCK] Memory get_all_memories for {user_id}")
        return [{"id": "1", "memory": "Mock memory", "created_at": str(datetime.now())}]

    def create_session(self, session_id: str, user_id: str) -> Dict[str, Any]:
        print(f"[MOCK] Memory create_session: {session_id}")
        return {"session_id": session_id, "user_id": user_id, "status": "created"}

    def add_message(self, session_id: str, role: str, content: str, **kwargs) -> Dict[str, str]:
        print(f"[MOCK] Memory add_message: {role} - {content[:50]}")
        return {"status": "added", "session_id": session_id}

    def get_memory(self, session_id: str) -> Dict[str, Any]:
        print(f"[MOCK] Memory get_memory: {session_id}")
        return {
            "session_id": session_id,
            "messages": [{"role": "user", "content": "Mock message"}],
            "summary": "Mock summary",
            "facts": ["Mock fact 1", "Mock fact 2"]
        }
