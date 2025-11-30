# Frontend - Sistema de Análisis Bibliométrico

Interfaz de usuario para el sistema de análisis bibliométrico con IA.

## Características

### Página de Análisis (`/analysis`)
- **Carga de archivos**: Interfaz drag-and-drop para subir archivos (XLSX, CSV, PDF, JSON)
- **Gestión de datasets**: Lista de archivos guardados con opción de seleccionar o eliminar
- **Editor de prompts**: Textarea para personalizar las instrucciones de análisis
- **Resultados**: Visualización de resultados en formato JSON o tabla, con descarga automática

### Componentes Principales

- `FileUpload`: Componente para cargar archivos
- `PromptEditor`: Editor de texto para prompts personalizados
- `DatasetList`: Lista de datasets guardados
- `AnalysisResults`: Visualización y descarga de resultados

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Estructura

```
frontend/src/
├── components/
│   ├── analysis/          # Componentes de análisis
│   │   ├── FileUpload.jsx
│   │   ├── PromptEditor.jsx
│   │   ├── DatasetList.jsx
│   │   └── AnalysisResults.jsx
│   └── UI/                # Componentes reutilizables
├── pages/
│   └── AnalysisPage.jsx    # Página principal de análisis
├── api/
│   └── services/
│       └── datasetService.js  # Servicios API para datasets
└── App.jsx                # Router principal
```

## Configuración

Asegúrate de tener configurada la variable de entorno:
```
VITE_API_URL=http://localhost:5000/api/v1
```

## Uso

1. Navega a `/analysis`
2. Sube un archivo o selecciona uno guardado
3. Personaliza el prompt de análisis (o usa el predeterminado)
4. Selecciona el formato de salida (JSON o PDF)
5. Ejecuta el análisis
6. Descarga los resultados
