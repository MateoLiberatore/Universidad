import sqlite3
from typing import Dict, Any, List, Optional

class PromptModel:
    def __init__(self, db_file="users.db"):
        self.db_file = db_file

    def connect(self):
        conn = sqlite3.connect(self.db_file)
        conn.row_factory = sqlite3.Row
        return conn

    def list_prompts(self, user_id: int) -> List[Dict[str, Any]]:
        conn = self.connect()
        cur = conn.cursor()
        cur.execute("SELECT * FROM prompts WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()
        return rows

    def get_prompt(self, user_id: int, id: int) -> Optional[Dict[str, Any]]:
        conn = self.connect()
        cur = conn.cursor()
        cur.execute("SELECT * FROM prompts WHERE id = ? AND user_id = ?", (id, user_id))
        row = cur.fetchone()
        conn.close()
        return dict(row) if row else None

    def create_prompt(self, user_id: int, title: str, description: str, text: str) -> Dict[str, Any]:
        conn = self.connect()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO prompts (user_id,title,description,prompt_text) VALUES (?,?,?,?)",
            (user_id, title, description, text)
        )
        conn.commit()
        new_id = cur.lastrowid
        conn.close()
        return self.get_prompt(user_id, new_id)

    def update_prompt(self, user_id: int, id: int, title: str, description: str, text: str) -> Dict[str, Any]:
        conn = self.connect()
        cur = conn.cursor()
        cur.execute(
            "UPDATE prompts SET title = ?, description = ?, prompt_text = ? WHERE id = ? AND user_id = ?",
            (title, description, text, id, user_id)
        )
        conn.commit()
        conn.close()
        return self.get_prompt(user_id, id)

    def delete_prompt(self, user_id: int, id: int):
        conn = self.connect()
        cur = conn.cursor()
        cur.execute("DELETE FROM prompts WHERE id = ? AND user_id = ?", (id, user_id))
        conn.commit()
        conn.close()
