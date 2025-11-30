from src.utils.error_handler import APIError

def process_gemini_task(payload: dict):
    """
    Procesa tareas de Gemini. Actualmente solo soporta análisis bibliométrico.
    """
    task_type = payload.get('task_type')
    data = payload.get('data')

    if task_type == 'bibliometric_analysis':
        from src.services.bibliometric_service import handle_bibliometric_analysis
        return handle_bibliometric_analysis(data)

    raise APIError("Unsupported Gemini task type. Only 'bibliometric_analysis' is supported.", status_code=400, response_json=None)

