"""
SQL Database Agent - Natural language to SQL queries
"""
import os
from typing import Optional, Dict, Any, List
from sqlalchemy import create_engine, text


class SQLDatabaseAgent:
    """
    SQL agent that converts natural language to SQL queries
    Uses LangChain SQL agent for safe query generation
    """

    def __init__(
        self,
        database_url: Optional[str] = None,
        anthropic_api_key: Optional[str] = None
    ):
        """
        Initialize SQL agent

        Args:
            database_url: SQLAlchemy database URL
            anthropic_api_key: Anthropic API key for Claude
        """
        self.database_url = database_url or os.getenv("DATABASE_URL")
        self.api_key = anthropic_api_key or os.getenv("ANTHROPIC_API_KEY")
        self.engine = None
        self.agent = None

        if self.database_url:
            self.engine = create_engine(self.database_url)

    def create_agent(self, include_tables: Optional[List[str]] = None):
        """
        Create SQL agent with LangChain

        Args:
            include_tables: List of tables to include (None = all tables)
        """
        try:
            from langchain_anthropic import ChatAnthropic
            from langchain_community.utilities import SQLDatabase
            from langchain_community.agent_toolkits import create_sql_agent

            llm = ChatAnthropic(
                model="claude-3-5-sonnet-20241022",
                api_key=self.api_key,
                temperature=0
            )

            db = SQLDatabase.from_uri(
                self.database_url,
                include_tables=include_tables
            )

            self.agent = create_sql_agent(
                llm=llm,
                db=db,
                agent_type="openai-tools",
                verbose=True
            )

        except ImportError:
            raise ImportError("langchain packages required. Install with: pip install langchain-anthropic langchain-community")

    def query(self, question: str) -> Dict[str, Any]:
        """
        Query database using natural language

        Args:
            question: Natural language question

        Returns:
            Query result and SQL generated
        """
        if not self.agent:
            self.create_agent()

        try:
            result = self.agent.invoke({"input": question})

            return {
                "question": question,
                "answer": result.get("output"),
                "status": "success"
            }

        except Exception as e:
            return {
                "question": question,
                "error": str(e),
                "status": "error"
            }

    def execute_raw_query(
        self,
        query: str,
        params: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Execute raw SQL query (for advanced users)

        Args:
            query: SQL query
            params: Query parameters

        Returns:
            Query results as list of dicts
        """
        if not self.engine:
            raise ValueError("Database engine not initialized")

        with self.engine.connect() as conn:
            result = conn.execute(text(query), params or {})
            rows = result.fetchall()

            return [dict(row._mapping) for row in rows]

    def get_table_info(self, table_name: str) -> Dict[str, Any]:
        """Get information about a table"""
        query = """
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = :table_name
        ORDER BY ordinal_position
        """

        columns = self.execute_raw_query(query, {"table_name": table_name})

        return {
            "table_name": table_name,
            "columns": columns
        }

    def list_tables(self) -> List[str]:
        """List all tables in database"""
        query = """
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
        """

        tables = self.execute_raw_query(query)
        return [t["table_name"] for t in tables]


class MockSQLAgent:
    """Mock SQL agent"""

    def __init__(self, *args, **kwargs):
        pass

    def create_agent(self, **kwargs):
        print("[MOCK] SQL agent created")

    def query(self, question: str) -> Dict[str, Any]:
        print(f"[MOCK] SQL query: {question}")
        return {
            "question": question,
            "answer": "Mock SQL result: Found 42 records matching your criteria",
            "sql_generated": "SELECT * FROM mock_table WHERE condition = true",
            "status": "success"
        }

    def execute_raw_query(self, query: str, **kwargs) -> List[Dict[str, Any]]:
        print(f"[MOCK] Execute raw SQL: {query}")
        return [
            {"id": 1, "name": "Mock Record 1", "value": 100},
            {"id": 2, "name": "Mock Record 2", "value": 200}
        ]

    def get_table_info(self, table_name: str) -> Dict[str, Any]:
        print(f"[MOCK] Get table info: {table_name}")
        return {
            "table_name": table_name,
            "columns": [
                {"column_name": "id", "data_type": "integer", "is_nullable": "NO"},
                {"column_name": "name", "data_type": "varchar", "is_nullable": "YES"}
            ]
        }

    def list_tables(self) -> List[str]:
        print("[MOCK] List tables")
        return ["users", "workflows", "executions", "mock_table"]
