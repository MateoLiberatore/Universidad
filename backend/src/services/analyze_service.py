import json
from src.configs.gemini_config import get_gemini_client, MODEL_NAME, SYSTEM_INSTRUCTION_BIBLIOMETRIC_ANALYSIS
from src.utils.error_handler import APIError

def analyze_with_gemini(unified_text: str, prompt_text: str):
    client = get_gemini_client()
    instruction = (
        SYSTEM_INSTRUCTION_BIBLIOMETRIC_ANALYSIS
        + "\n\nResponde únicamente en JSON con la estructura:\n"
        + '{"columns": [...], "rows": [...]}\n'
        + "Prompt del usuario:\n"
        + prompt_text
        + "\n\nContenido:\n"
        + unified_text
    )

    result = client.models.generate_content(
        model=MODEL_NAME,
        contents=[{"role": "user", "parts": [{"text": instruction}]}]
    )

    raw = result.text or ""
    start = raw.find("{")
    end = raw.rfind("}")
    if start == -1 or end == -1:
        raise APIError("JSON inválido en la respuesta del modelo.", 500)

    data = json.loads(raw[start:end+1])

    if "columns" not in data or "rows" not in data:
        raise APIError("Estructura JSON incorrecta.", 500)

    return data
