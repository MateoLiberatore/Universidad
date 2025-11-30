from src.utils.error_handler import APIError

class GeminiRequestModel:
    
    # Supported task types for bibliometric analysis
    SUPPORTED_TASK_TYPES = ["bibliometric_analysis"] 

    @classmethod
    def validate_request(cls, payload):
        
        if not isinstance(payload, dict):
            raise APIError("Invalid payload. A JSON object is expected.", status_code=400)

        task_type = payload.get('task_type')
        data = payload.get('data')

        if not task_type or not data:
            raise APIError("Missing mandatory fields: 'task_type' or 'data'.", status_code=400)

        if task_type not in cls.SUPPORTED_TASK_TYPES:
            raise APIError(f"Unsupported task type: {task_type}. Allowed types: {', '.join(cls.SUPPORTED_TASK_TYPES)}", status_code=400)

        return payload

