from flask import Blueprint, jsonify, request, send_file
from src.controllers.dataset_controller import Dataset_Controller
from src.utils.error_handler import APIError
from src.utils.auth_utils import jwt_required
import os

dataset_bp = Blueprint("datasets", __name__)

@dataset_bp.route("/upload", methods=["POST", "OPTIONS"])
@jwt_required
def upload_file():
    """Upload a dataset file"""
    if 'file' not in request.files:
        raise APIError("No file provided", status_code=400)
    
    file = request.files['file']
    user_id = request.user_id
    
    response = Dataset_Controller.handle_upload_file(file, user_id)
    return jsonify(response), 201

@dataset_bp.route("/", methods=["GET", "OPTIONS"])
@jwt_required
def get_datasets():
    """Get all datasets for the current user"""
    user_id = request.user_id
    response = Dataset_Controller.handle_get_datasets(user_id)
    return jsonify(response), 200

@dataset_bp.route("/<int:dataset_id>", methods=["GET", "OPTIONS"])
@jwt_required
def get_dataset(dataset_id):
    """Get a specific dataset"""
    user_id = request.user_id
    response = Dataset_Controller.handle_get_dataset(dataset_id, user_id)
    return jsonify(response), 200

@dataset_bp.route("/<int:dataset_id>", methods=["DELETE", "OPTIONS"])
@jwt_required
def delete_dataset(dataset_id):
    """Delete a dataset"""
    user_id = request.user_id
    Dataset_Controller.handle_delete_dataset(dataset_id, user_id)
    return jsonify({"message": "Dataset deleted successfully"}), 200

@dataset_bp.route("/analyze", methods=["POST", "OPTIONS"])
@jwt_required
def analyze_dataset():
    """Analyze a dataset with bibliometric analysis"""
    payload = request.get_json()
    if not payload:
        raise APIError("Petición inválida: se esperaba JSON.", status_code=400)
    
    user_id = request.user_id
    response = Dataset_Controller.handle_analyze_dataset(payload, user_id)
    return jsonify(response), 200

