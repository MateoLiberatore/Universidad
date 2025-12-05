import os
import pandas as pd
import PyPDF2
import json
from werkzeug.utils import secure_filename
from src.utils.error_handler import APIError

ALLOWED_EXTENSIONS = {'xlsx', 'xls', 'csv', 'pdf', 'json'}
UPLOAD_FOLDER = 'uploads'

def ensure_upload_folder():
    """Ensure the upload folder exists"""
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file, user_id):
    """Save uploaded file and return file info"""
    ensure_upload_folder()
    
    if not file or not file.filename:
        raise APIError("No file provided", status_code=400, response_json=None)
    
    if not allowed_file(file.filename):
        raise APIError(
            f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}",
            status_code=400,
            response_json=None
        )
    
    filename = secure_filename(file.filename)
    file_ext = filename.rsplit('.', 1)[1].lower()
    
    # Create user-specific folder
    user_folder = os.path.join(UPLOAD_FOLDER, str(user_id))
    if not os.path.exists(user_folder):
        os.makedirs(user_folder)
    
    # Generate unique filename
    import time
    unique_filename = f"{int(time.time())}_{filename}"
    file_path = os.path.join(user_folder, unique_filename)
    
    file.save(file_path)
    file_size = os.path.getsize(file_path)
    
    return {
        'filename': unique_filename,
        'original_filename': filename,
        'file_path': file_path,
        'file_type': file_ext,
        'file_size': file_size
    }

def read_excel_file(file_path):
    """Read Excel file and return content as string"""
    try:
        df = pd.read_excel(file_path)
        return df.to_string()
    except Exception as e:
        raise APIError(f"Error reading Excel file: {e}", status_code=500, response_json=None)

def read_csv_file(file_path):
    """Read CSV file and return content as string"""
    try:
        df = pd.read_csv(file_path)
        return df.to_string()
    except Exception as e:
        raise APIError(f"Error reading CSV file: {e}", status_code=500, response_json=None)

def read_pdf_file(file_path):
    """Read PDF file and return text content"""
    try:
        text_content = []
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text_content.append(page.extract_text())
        return '\n\n'.join(text_content)
    except Exception as e:
        raise APIError(f"Error reading PDF file: {e}", status_code=500, response_json=None)

def read_json_file(file_path):
    """Read JSON file and return formatted string"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            return json.dumps(data, indent=2, ensure_ascii=False)
    except Exception as e:
        raise APIError(f"Error reading JSON file: {e}", status_code=500, response_json=None)

def read_file_content(file_path, file_type):
    """Read file content based on file type"""
    file_type = file_type.lower()
    
    if file_type in ['xlsx', 'xls']:
        return read_excel_file(file_path)
    elif file_type == 'csv':
        return read_csv_file(file_path)
    elif file_type == 'pdf':
        return read_pdf_file(file_path)
    elif file_type == 'json':
        return read_json_file(file_path)
    else:
        raise APIError(f"Unsupported file type: {file_type}", status_code=400, response_json=None)

