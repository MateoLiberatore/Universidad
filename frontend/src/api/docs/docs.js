const docs = {
  "apiName": "BibliometricAI API",
  "version": "v1",
  "description": "REST API para análisis bibliométrico con IA usando Gemini API. Permite cargar archivos científicos (PDF, XLSX, CSV, JSON) y realizar análisis bibliométricos automatizados.",
  "basePath": "/api/v1",
  "endpoints": [
    {
      "path": "/auth/login",
      "method": "POST",
      "summary": "login and creation of token JWT",
      "tags": ["Auth"],
      "security": "None",
      "request": {
        "contentType": "application/json",
        "body": {
          "email": {"type": "string", "required": true, "description": "User Email.", "example": "user@example.com"},
          "password": {"type": "string", "required": true, "description": "User password.", "example": "mypassword"}
        }
      },
      "response": {
        "200": {
          "description": "Login succesfull.",
          "body": {
            "message": {"type": "string", "example": "Login succesfull."},
            "token": {"type": "string", "description": "JSON Web Token for protected routes.", "example": "eyJhb..."},
            "user": {"type": "object", "description": "Basic user data.", "fields": {"id": "number", "username": "string", "email": "string"}}
          }
        },
        "400": {"description": "Invalid request. Missing fields."},
        "401": {"description": "Invalid credentials."},
        "404": {"description": "User does not exist."}
      }
    },
    {
      "path": "/auth/profile",
      "method": "GET",
      "summary": "Obtain auth. user datas",
      "tags": ["Auth"],
      "security": "JWT Bearer Token",
      "request": {
        "headers": {"Authorization": {"type": "string", "required": true, "description": "Bearer <jwt_token>"}}
      },
      "response": {
        "200": {
          "description": "Obtained profile.",
          "body": {
            "user": {"type": "object", "description": "Datos del perfil.", "fields": {"id": "number", "username": "string", "email": "string"}}
          }
        },
        "401": {"description": "Not authorized. Invalid or missing Token."}
      }
    },
    {
      "path": "/datasets/upload",
      "method": "POST",
      "summary": "Subir archivo para análisis bibliométrico",
      "tags": ["Datasets", "Files"],
      "security": "JWT Bearer Token",
      "request": {
        "contentType": "multipart/form-data",
        "headers": {"Authorization": {"type": "string", "required": true, "description": "Bearer <jwt_token>"}},
        "body": {
          "file": {"type": "file", "required": true, "description": "Archivo a subir (PDF, XLSX, CSV, JSON)"}
        }
      },
      "response": {
        "201": {
          "description": "Archivo subido exitosamente.",
          "body": {
            "id": {"type": "number", "description": "ID del dataset"},
            "filename": {"type": "string", "description": "Nombre original del archivo"},
            "file_type": {"type": "string", "description": "Tipo de archivo"},
            "file_size": {"type": "number", "description": "Tamaño en bytes"},
            "uploaded_at": {"type": "string", "description": "Fecha de subida"}
          }
        },
        "400": {"description": "Archivo inválido o tipo no permitido."},
        "401": {"description": "Not authorized. Invalid Token."}
      }
    },
    {
      "path": "/datasets/",
      "method": "GET",
      "summary": "Obtener todos los datasets del usuario",
      "tags": ["Datasets"],
      "security": "JWT Bearer Token",
      "request": {
        "headers": {"Authorization": {"type": "string", "required": true, "description": "Bearer <jwt_token>"}}
      },
      "response": {
        "200": {
          "description": "Lista de datasets obtenida exitosamente.",
          "body": {
            "datasets": {"type": "array", "description": "Lista de datasets del usuario"}
          }
        },
        "401": {"description": "Not authorized. Invalid Token."}
      }
    },
    {
      "path": "/datasets/analyze",
      "method": "POST",
      "summary": "Analizar dataset con IA",
      "tags": ["Datasets", "AI", "Analysis"],
      "security": "JWT Bearer Token",
      "request": {
        "contentType": "application/json",
        "headers": {"Authorization": {"type": "string", "required": true, "description": "Bearer <jwt_token>"}},
        "body": {
          "dataset_id": {"type": "number", "required": true, "description": "ID del dataset a analizar"},
          "user_prompt": {"type": "string", "required": true, "description": "Instrucciones específicas para el análisis"},
          "output_format": {"type": "string", "required": false, "description": "Formato de salida: 'json' o 'pdf'", "example": "json"}
        }
      },
      "response": {
        "200": {
          "description": "Análisis completado exitosamente.",
          "body": {
            "result": {"type": "object", "description": "Resultados del análisis estructurados"},
            "format": {"type": "string", "description": "Formato de salida"},
            "pdf_base64": {"type": "string", "description": "PDF en base64 (si output_format es 'pdf')"}
          }
        },
        "400": {"description": "Invalid request. Missing required fields."},
        "401": {"description": "Not authorized. Invalid Token."},
        "404": {"description": "Dataset not found."},
        "500": {"description": "Gemini API or Internal Server Error."}
      }
    }
  ]
};

export default docs;