import os
from flask import Flask, request, make_response
from flask_cors import CORS
from dotenv import load_dotenv

from src.routes.auth.auth_routes import auth_bp
from src.routes.analysis.analysis_routes import analysis_bp
from src.routes.prompt.prompt_routes import prompt_bp

from src.utils.error_handler import register_error_handlers
from src.configs.db import db_generation

load_dotenv()
app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")

CORS(
    app,
    origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://mateoliberatore.github.io"
    ],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    expose_headers=["Authorization"]
)

db_generation()

@app.before_request
def handle_options_requests():
    if request.method == "OPTIONS":
        return make_response("", 200)

app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
app.register_blueprint(analysis_bp, url_prefix="/api/v1/analysis")
app.register_blueprint(prompt_bp, url_prefix="/api/v1/prompts")

register_error_handlers(app)

@app.route("/")
def home():
    return "API is running."

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
