# Backend - Sistema de Análisis Bibliométrico con IA

Sistema de análisis de datos bibliométricos con integración de IA usando Google Gemini. Permite procesar documentos científicos (PDF, XLSX, CSV, JSON) y realizar análisis bibliométricos automatizados.

## Características Principales

### 1. Carga de Archivos
- Soporte para múltiples formatos: XLSX, CSV, PDF, JSON
- Almacenamiento persistente de datasets
- Gestión de archivos por usuario

### 2. Análisis Bibliométrico con IA
- Procesamiento de documentos científicos con Gemini
- Extracción estructurada de datos bibliométricos
- Configuración personalizable de prompts

### 3. Generación de Reportes
- Exportación en formato JSON
- Generación automática de PDFs con tablas formateadas
- Descarga automática de resultados

## Estructura del Proyecto

```
backend/
├── src/
│   ├── configs/
│   │   ├── db.py              # Configuración de base de datos
│   │   └── gemini_config.py   # Configuración de Gemini y prompts
│   ├── controllers/
│   │   ├── auth_controller.py
│   │   └── dataset_controller.py  # Controlador de datasets
│   ├── models/
│   │   ├── user_model.py
│   │   ├── dataset_model.py      # Modelo de datos para datasets
│   │   └── gemini_model.py
│   ├── routes/
│   │   ├── auth/
│   │   │   └── auth_routes.py
│   │   └── datasets/
│   │       └── dataset_routes.py # Rutas API para datasets
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── bibliometric_service.py  # Servicio de análisis bibliométrico
│   │   ├── dataset_service.py       # Servicio de gestión de datasets
│   │   └── gemini_service.py
│   └── utils/
│       ├── auth_utils.py
│       ├── error_handler.py
│       ├── file_processor.py   # Utilidades para procesar archivos
│       └── pdf_generator.py    # Generador de PDFs
├── uploads/                    # Directorio de archivos subidos
└── requirements.txt           # Dependencias Python
```

## Instalación

1. Instalar dependencias:
```bash
poetry install
```

2. Configurar variables de entorno (.env):
```
GEMINI_API_KEY=tu_api_key_aqui
SECRET_KEY=tu_secret_key_aqui
```

3. Ejecutar la aplicación:
```bash
poetry run python app.py
```

## API Endpoints

### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/profile` - Obtener perfil del usuario

### Datasets

- `POST /api/v1/datasets/upload` - Subir un archivo
- `GET /api/v1/datasets/` - Obtener todos los datasets del usuario
- `GET /api/v1/datasets/<id>` - Obtener un dataset específico
- `DELETE /api/v1/datasets/<id>` - Eliminar un dataset
- `POST /api/v1/datasets/analyze` - Analizar un dataset

### Análisis

El endpoint de análisis espera el siguiente payload:

```json
{
  "dataset_id": 1,
  "user_prompt": "Instrucciones específicas para el análisis...",
  "output_format": "json"  // o "pdf"
}
```

## Configuración del Agente

El agente está configurado como experto en análisis bibliométrico. Ver `AGENT_CONFIGURATION_SUGGESTIONS.md` para sugerencias de mejoras adicionales.

## Base de Datos

El sistema usa SQLite con dos tablas principales:
- `users`: Usuarios del sistema
- `datasets`: Archivos subidos y sus metadatos

La tabla `datasets` se crea automáticamente al iniciar la aplicación.

## Notas

- Los archivos se almacenan en `uploads/<user_id>/`
- Los archivos PDF se procesan directamente con Gemini File API
- Otros formatos se leen y envían como texto al modelo

