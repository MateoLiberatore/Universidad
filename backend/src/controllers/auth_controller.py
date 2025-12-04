from src.services.auth_service import login_user, get_user_profile
from src.utils.error_handler import APIError

class AuthController:
    """
    stateless
    """
    @staticmethod
    def handle_login(payload):
        email = payload.get('email')
        password = payload.get('password')

        if not email or not password:
            raise APIError("Email and password are required.", status_code=400)

        try:
            response = login_user(email, password)
            return response
        except APIError as e:
            raise e
        except Exception as e:
            print(f"Internal error in AuthController.handle_login: {e}")
            raise APIError("Internal server error while processing the authentication task.", status_code=500)

    @staticmethod
    def handle_profile(user_id):
        try:
            user = get_user_profile(user_id)
            return {"user": user}
        except APIError as e:
            raise e
        except Exception as e:
            print(f"Internal error in AuthController.handle_profile: {e}")
            raise APIError("Internal server error while processing the profile request.", status_code=500)

auth_controller = AuthController()

