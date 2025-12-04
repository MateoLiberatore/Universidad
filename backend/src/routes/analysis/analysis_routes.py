from flask import Blueprint, request, jsonify, send_file
import json, io
from src.controllers.analysis_controller import AnalysisController
from src.utils.auth_utils import jwt_required

analysis_bp = Blueprint("analysis", __name__)

@analysis_bp.route("/run", methods=["POST"])
@jwt_required
def run_analysis():
    files = request.files.getlist("files")
    prompt = request.form.get("prompt", "")
    result = AnalysisController.analyze(files, prompt)
    return jsonify(result), 200

@analysis_bp.route("/export", methods=["POST"])
@jwt_required
def export_analysis():
    payload = request.get_json() or {}
    table = payload.get("table")
    fmt = payload.get("format")
    content, mimetype, filename = AnalysisController.export(json.dumps(table, ensure_ascii=False), fmt)
    return send_file(io.BytesIO(content), mimetype=mimetype, as_attachment=True, download_name=filename)
    