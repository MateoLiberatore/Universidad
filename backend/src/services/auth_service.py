from werkzeug.security import check_password_hash
from src.models.user_model import UserModel
from src.utils.auth_utils import create_jwt_token
from src.utils.error_handler import APIError

user_model = UserModel()

def login_user(email, password):
    """Authenticate user and return JWT token"""
    user = user_model.get_user_by_email(email)
    
    if not user:
        raise APIError("User not found.", status_code=404, response_json=None)
    
    if not check_password_hash(user['password'], password):
        raise APIError("Invalid credentials.", status_code=401, response_json=None)
    
    token = create_jwt_token(user['id'])
    
    return {
        "token": token,
        "user": {
            "id": user['id'],
            "username": user['username'],
            "email": user['email']
        }
    }

def get_user_profile(user_id):
    """Get user profile by ID"""
    user = user_model.get_user_by_id(user_id)
    
    if not user:
        raise APIError("User not found.", status_code=404, response_json=None)
    
    return {
        "id": user['id'],
        "username": user['username'],
        "email": user['email']
    }

