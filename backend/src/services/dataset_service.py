from src.models.dataset_model import DatasetModel
from src.utils.file_processor import save_uploaded_file
from src.services.bibliometric_service import handle_bibliometric_analysis
from src.utils.error_handler import APIError

dataset_model = DatasetModel()

def upload_dataset_file(file, user_id):
    """Upload and save a dataset file"""
    file_info = save_uploaded_file(file, user_id)
    
    dataset = dataset_model.create_dataset(
        user_id=user_id,
        filename=file_info['filename'],
        original_filename=file_info['original_filename'],
        file_path=file_info['file_path'],
        file_type=file_info['file_type'],
        file_size=file_info['file_size']
    )
    
    return {
        "id": dataset['id'],
        "filename": dataset['original_filename'],
        "file_type": dataset['file_type'],
        "file_size": dataset['file_size'],
        "uploaded_at": dataset['uploaded_at']
    }

def get_user_datasets(user_id):
    """Get all datasets for a user"""
    datasets = dataset_model.get_datasets_by_user(user_id)
    
    return {
        "datasets": [
            {
                "id": d['id'],
                "filename": d['original_filename'],
                "file_type": d['file_type'],
                "file_size": d['file_size'],
                "uploaded_at": d['uploaded_at']
            }
            for d in datasets
        ]
    }

def get_dataset_by_id(dataset_id, user_id):
    """Get a specific dataset by ID"""
    dataset = dataset_model.get_dataset_by_id(dataset_id, user_id)
    
    if not dataset:
        raise APIError("Dataset not found", status_code=404, response_json=None)
    
    return {
        "id": dataset['id'],
        "filename": dataset['original_filename'],
        "file_type": dataset['file_type'],
        "file_size": dataset['file_size'],
        "uploaded_at": dataset['uploaded_at']
    }

def delete_dataset_file(dataset_id, user_id):
    """Delete a dataset file"""
    dataset_model.delete_dataset(dataset_id, user_id)
    return {"message": "Dataset deleted successfully"}

def analyze_dataset_with_gemini(payload, user_id):
    """Analyze a dataset using Gemini"""
    dataset_id = payload.get('dataset_id')
    user_prompt = payload.get('user_prompt', '')
    output_format = payload.get('output_format', 'json')
    
    if not dataset_id:
        raise APIError("dataset_id is required", status_code=400, response_json=None)
    
    # Get dataset
    dataset = dataset_model.get_dataset_by_id(dataset_id, user_id)
    if not dataset:
        raise APIError("Dataset not found", status_code=404, response_json=None)
    
    # Prepare data for analysis
    analysis_data = {
        'file_path': dataset['file_path'],
        'user_prompt': user_prompt,
        'output_format': output_format
    }
    
    # Call bibliometric analysis service
    result = handle_bibliometric_analysis(analysis_data)
    
    return result

