from flask import jsonify

class APIError(Exception):
    def __init__(self, message, status_code=400, response_json=None):
        self.message = message
        self.status_code = status_code
        self.response_json = response_json
        super().__init__(self.message)

def register_error_handlers(app):
    @app.errorhandler(APIError)
    def handle_api_error(error):
        response = jsonify({
            "message": error.message,
            "status_code": error.status_code
        })
        response.status_code = error.status_code
        return response

    @app.errorhandler(404)
    def handle_not_found(error):
        response = jsonify({
            "message": "Resource not found",
            "status_code": 404
        })
        response.status_code = 404
        return response

    @app.errorhandler(500)
    def handle_internal_error(error):
        response = jsonify({
            "message": "Internal server error",
            "status_code": 500
        })
        response.status_code = 500
        return response

