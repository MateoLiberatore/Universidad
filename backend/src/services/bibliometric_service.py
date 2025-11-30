import os
import json
import base64
from google import genai
from src.configs.gemini_config import (
    get_gemini_client,
    MODEL_NAME,
    SYSTEM_INSTRUCTION_BIBLIOMETRIC_ANALYSIS
)
from src.utils.error_handler import APIError
from src.utils.file_processor import read_file_content
from src.utils.pdf_generator import generate_pdf_from_data

def _prepare_file_for_gemini(file_path, file_type):
    """Prepare file for Gemini API upload"""
    client = get_gemini_client()
    
    # Determine MIME type
    mime_types = {
        'pdf': 'application/pdf',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xls': 'application/vnd.ms-excel',
        'csv': 'text/csv',
        'json': 'application/json'
    }
    mime_type = mime_types.get(file_type.lower(), 'application/octet-stream')
    
    # Upload file to Gemini
    uploaded_file = client.files.upload(path=file_path, mime_type=mime_type)
    
    return uploaded_file

def _call_gemini_with_file(uploaded_file, user_prompt, system_instruction):
    """Call Gemini API with uploaded file"""
    client = get_gemini_client()
    
    # Wait for file to be processed
    import time
    while uploaded_file.state.name == "PROCESSING":
        time.sleep(2)
        uploaded_file = client.files.get(name=uploaded_file.name)
    
    if uploaded_file.state.name == "FAILED":
        raise APIError("File processing failed", status_code=500, response_json=None)
    
    # Generate content with file
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=[
            user_prompt,
            genai.types.Part.from_uri(
                file_uri=uploaded_file.uri,
                mime_type=uploaded_file.mime_type
            )
        ],
        config=genai.types.GenerateContentConfig(
            system_instruction=system_instruction
        )
    )
    
    return response

def _parse_analysis_result(result_text):
    """Parse the analysis result and try to extract structured data"""
    try:
        # Try to parse as JSON first
        if result_text.strip().startswith('{') or result_text.strip().startswith('['):
            return json.loads(result_text)
        
        # Try to extract table data
        lines = result_text.strip().split('\n')
        if len(lines) < 2:
            return {"raw": result_text}
        
        # Check if it's a table format
        if '|' in lines[0]:
            headers = [h.strip() for h in lines[0].split('|') if h.strip()]
            rows = []
            for line in lines[1:]:
                if '|' in line:
                    cells = [c.strip() for c in line.split('|') if c.strip()]
                    if len(cells) == len(headers):
                        rows.append(dict(zip(headers, cells)))
            return rows if rows else {"raw": result_text}
        
        return {"raw": result_text}
    except json.JSONDecodeError:
        return {"raw": result_text}

def handle_bibliometric_analysis(data: dict) -> dict:
    """Handle bibliometric analysis request"""
    file_path = data.get('file_path')
    user_prompt = data.get('user_prompt', '')
    output_format = data.get('output_format', 'json')
    
    if not file_path:
        raise APIError("File path is required", status_code=400, response_json=None)
    
    if not os.path.exists(file_path):
        raise APIError("File not found", status_code=404, response_json=None)
    
    # Get file type from path
    file_type = file_path.rsplit('.', 1)[1].lower() if '.' in file_path else 'pdf'
    
    # Build system instruction with user prompt
    system_instruction = SYSTEM_INSTRUCTION_BIBLIOMETRIC_ANALYSIS
    if user_prompt:
        system_instruction += f"\n\nINSTRUCCIONES ESPECÍFICAS DEL USUARIO:\n{user_prompt}"
    
    uploaded_file = None
    try:
        # For PDF files, use file upload API
        # For other files, we can also use file upload or read content directly
        if file_type == 'pdf':
            # Upload and process file with Gemini
            uploaded_file = _prepare_file_for_gemini(file_path, file_type)
            response = _call_gemini_with_file(uploaded_file, user_prompt, system_instruction)
        else:
            # For non-PDF files, read content and send as text
            file_content = read_file_content(file_path, file_type)
            full_prompt = f"{user_prompt}\n\nContenido del archivo:\n{file_content}"
            
            client = get_gemini_client()
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=full_prompt,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_instruction
                )
            )
        
        result_text = response.text
        
        # Parse result
        parsed_result = _parse_analysis_result(result_text)
        
        # Generate output based on format
        if output_format == 'pdf':
            pdf_buffer = generate_pdf_from_data(parsed_result, "Análisis Bibliométrico")
            pdf_base64 = base64.b64encode(pdf_buffer.getvalue()).decode('utf-8')
            return {
                "result": parsed_result,
                "pdf_base64": pdf_base64,
                "format": "pdf"
            }
        else:
            return {
                "result": parsed_result,
                "format": "json"
            }
            
    except genai.errors.APIError as e:
        status_code = 500
        if hasattr(e, 'response_json') and e.response_json and 'error' in e.response_json and 'code' in e.response_json['error']:
            status_code = e.response_json['error']['code']
        raise APIError(f"Error in the Gemini API. Original message: {e}", status_code=status_code, response_json=None)
    except Exception as e:
        raise APIError(f"Unexpected error processing bibliometric analysis: {e}", status_code=500, response_json=None)
    finally:
        # Clean up uploaded file if needed
        try:
            if uploaded_file:
                client = get_gemini_client()
                client.files.delete(name=uploaded_file.name)
        except:
            pass

