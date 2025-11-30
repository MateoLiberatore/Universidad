from flask import Blueprint, jsonify, request
from src.controllers.auth_controller import auth_controller
from src.utils.error_handler import APIError
from src.utils.auth_utils import jwt_required

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST", "OPTIONS"])
def login():
    payload = request.get_json()
    if not payload:
        raise APIError("Petición inválida: se esperaba JSON.", status_code=400)

    response = auth_controller.handle_login(payload)
    return jsonify({
        "message": "Login succesfull.",
        "token": response["token"],
        "user": response["user"]
    }), 200

@auth_bp.route("/profile", methods=["GET", "OPTIONS"])
@jwt_required
def profile():
    user_id = request.user_id
    response = auth_controller.handle_profile(user_id)
    return jsonify(response), 200

