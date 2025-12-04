from src.services.file_parse_service import parse_file_storage
from src.services.analyze_service import analyze_with_gemini
from src.services.export_service import make_export
from src.utils.error_handler import APIError

class AnalysisController:
    @staticmethod
    def analyze(files, prompt):
        if not files:
            raise APIError("Debes cargar archivos.", 400)
        if not prompt.strip():
            raise APIError("Prompt requerido.", 400)
        parsed = [parse_file_storage(f) for f in files]
        unified = "\n\n".join(parsed)
        return analyze_with_gemini(unified, prompt)

    @staticmethod
    def export(raw_json, fmt):
        return make_export(raw_json, fmt)
