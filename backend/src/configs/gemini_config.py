import os
from google import genai
from src.utils.error_handler import APIError

MODEL_NAME = "gemini-2.5-flash"

SYSTEM_INSTRUCTION_BIBLIOMETRIC_ANALYSIS = (
    "Eres un experto en análisis bibliométrico.\n\n"
    "Vamos a realizar un proceso de extracción de datos para calcular métricas bibliométricas de artículos científicos que serán subidos en archivos en formato pdf en diferentes tandas.\n\n"
    "En la lectura de los archivos deben considerarse todas las partes que lo componen. Debe también incluirse los metadatos. En la lectura debe tenerse en cuenta el tipo de dato que se está solicitando.\n\n"
    "Es extremadamente importante que los resultados sean muy precisos y confiables.\n\n"
    "Debes procesar los archivos proporcionados y extraer la información solicitada según las instrucciones del usuario."
    "La salida debe ser estructurada y precisa, siguiendo exactamente el formato especificado en las instrucciones."
)

def get_gemini_client():
    """
    Factory function that returns an instance of the Gemini client.
    It implements the Dependency Inversion Principle (DIP) by acting as an abstraction.
    """
    API_KEY = os.environ.get("GEMINI_API_KEY")

    if not API_KEY:
        raise APIError("The Gemini client is not configured (Missing API Key)", status_code=500)

    try:
        return genai.Client(api_key=API_KEY)
    
    except Exception as e:
        raise APIError(f"Error initializing the Gemini client: {e}", status_code=500)

