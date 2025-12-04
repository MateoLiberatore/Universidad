from flask import Blueprint, request, jsonify
from src.controllers.prompt_controller import PromptController
from src.utils.auth_utils import jwt_required

prompt_bp = Blueprint("prompts", __name__)
controller = PromptController()

@prompt_bp.route("/", methods=["GET"])
@jwt_required
def list_prompts():
    return jsonify(controller.list(request.user_id)), 200

@prompt_bp.route("/<int:id>", methods=["GET"])
@jwt_required
def get_prompt(id):
    return jsonify(controller.get(request.user_id, id)), 200

@prompt_bp.route("/", methods=["POST"])
@jwt_required
def create_prompt():
    return jsonify(controller.create(request.user_id, request.get_json() or {})), 201

@prompt_bp.route("/<int:id>", methods=["PUT"])
@jwt_required
def update_prompt(id):
    return jsonify(controller.update(request.user_id, id, request.get_json() or {})), 200

@prompt_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required
def delete_prompt(id):
    return jsonify(controller.delete(request.user_id, id)), 200
