from src.services.prompt_service import (
    list_user_prompts,
    get_user_prompt,
    create_user_prompt,
    update_user_prompt,
    delete_user_prompt
)
from src.utils.error_handler import APIError

class PromptController:
    @staticmethod
    def list(user_id: int):
        return list_user_prompts(user_id)

    @staticmethod
    def get(user_id: int, id: int):
        return get_user_prompt(user_id, id)

    @staticmethod
    def create(user_id: int, payload):
        title = payload.get("title", "").strip()
        description = payload.get("description", "")
        text = payload.get("prompt_text", "").strip()
        if not title or not text:
            raise APIError("Título y texto requeridos.", 400)
        return create_user_prompt(user_id, title, description, text)

    @staticmethod
    def update(user_id: int, id: int, payload):
        title = payload.get("title", "").strip()
        description = payload.get("description", "")
        text = payload.get("prompt_text", "").strip()
        if not title or not text:
            raise APIError("Título y texto requeridos.", 400)
        return update_user_prompt(user_id, id, title, description, text)

    @staticmethod
    def delete(user_id: int, id: int):
        delete_user_prompt(user_id, id)
        return {"message": "Prompt eliminado"}
