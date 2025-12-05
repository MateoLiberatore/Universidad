from src.services.dataset_service import (
    upload_dataset_file,
    get_user_datasets,
    get_dataset_by_id,
    delete_dataset_file,
    analyze_dataset_with_gemini
)
from src.utils.error_handler import APIError

class Dataset_Controller:
    """
    stateless
    """
    @staticmethod
    def handle_upload_file(file, user_id):
        try:
            response = upload_dataset_file(file, user_id)
            return response
        except APIError as e:
            raise e
        except Exception as e:
            print(f"Internal error in Dataset_Controller.handle_upload_file: {e}")
            raise APIError("Internal server error while uploading file.", status_code=500)
    
    @staticmethod
    def handle_get_datasets(user_id):
        try:
            response = get_user_datasets(user_id)
            return response
        except APIError as e:
            raise e
        except Exception as e:
            print(f"Internal error in Dataset_Controller.handle_get_datasets: {e}")
            raise APIError("Internal server error while fetching datasets.", status_code=500)
    
    @staticmethod
    def handle_get_dataset(dataset_id, user_id):
        try:
            response = get_dataset_by_id(dataset_id, user_id)
            return response
        except APIError as e:
            raise e
        except Exception as e:
            print(f"Internal error in Dataset_Controller.handle_get_dataset: {e}")
            raise APIError("Internal server error while fetching dataset.", status_code=500)
    
    @staticmethod
    def handle_delete_dataset(dataset_id, user_id):
        try:
            delete_dataset_file(dataset_id, user_id)
            return {"message": "Dataset deleted successfully"}
        except APIError as e:
            raise e
        except Exception as e:
            print(f"Internal error in Dataset_Controller.handle_delete_dataset: {e}")
            raise APIError("Internal server error while deleting dataset.", status_code=500)
    
    @staticmethod
    def handle_analyze_dataset(payload, user_id):
        try:
            response = analyze_dataset_with_gemini(payload, user_id)
            return response
        except APIError as e:
            raise e
        except Exception as e:
            print(f"Internal error in Dataset_Controller.handle_analyze_dataset: {e}")
            raise APIError("Internal server error while analyzing dataset.", status_code=500)

dataset_controller = Dataset_Controller()

