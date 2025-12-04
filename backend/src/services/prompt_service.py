from src.models.prompt_model import PromptModel
from src.utils.error_handler import APIError

model = PromptModel()

def list_user_prompts(user_id: int):
    return model.list_prompts(user_id)

def get_user_prompt(user_id: int, prompt_id: int):
    p = model.get_prompt(user_id, prompt_id)
    if not p:
        raise APIError("Prompt no encontrado.", 404)
    return p

def create_user_prompt(user_id: int, title: str, description: str, text: str):
    return model.create_prompt(user_id, title, description, text)

def update_user_prompt(user_id: int, prompt_id: int, title: str, description: str, text: str):
    return model.update_prompt(user_id, prompt_id, title, description, text)

def delete_user_prompt(user_id: int, prompt_id: int):
    return model.delete_prompt(user_id, prompt_id)
