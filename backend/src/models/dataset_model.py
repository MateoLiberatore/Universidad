import sqlite3
import os
from datetime import datetime
from src.utils.error_handler import APIError

class DatasetModel:
    
    def __init__(self, db_file="users.db"):
        self.db_file = db_file

    def connect(self):
        try:
            conn = sqlite3.connect(self.db_file)
            conn.row_factory = sqlite3.Row
            return conn
        except sqlite3.Error as e:
            raise APIError(f"Error connecting to the database: {e}", status_code=500, response_json=None)

    def create_dataset(self, user_id, filename, original_filename, file_path, file_type, file_size):
        conn = self.connect()
        try:
            with conn:
                cursor = conn.cursor()
                cursor.execute(
                    """
                    INSERT INTO datasets (user_id, filename, original_filename, file_path, file_type, file_size)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (user_id, filename, original_filename, file_path, file_type, file_size)
                )
                dataset_id = cursor.lastrowid
                return {
                    "id": dataset_id,
                    "user_id": user_id,
                    "filename": filename,
                    "original_filename": original_filename,
                    "file_path": file_path,
                    "file_type": file_type,
                    "file_size": file_size,
                    "uploaded_at": datetime.now().isoformat()
                }
        except sqlite3.Error as e:
            raise APIError(f"An error occurred while creating the dataset: {e}", status_code=500, response_json=None)
        finally:
            conn.close()

    def get_datasets_by_user(self, user_id):
        conn = self.connect()
        try:
            with conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT * FROM datasets WHERE user_id = ? ORDER BY uploaded_at DESC",
                    (user_id,)
                )
                datasets = cursor.fetchall()
                return [dict(dataset) for dataset in datasets]
        except sqlite3.Error as e:
            raise APIError(f"An error occurred while fetching datasets: {e}", status_code=500, response_json=None)
        finally:
            conn.close()

    def get_dataset_by_id(self, dataset_id, user_id):
        conn = self.connect()
        try:
            with conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT * FROM datasets WHERE id = ? AND user_id = ?",
                    (dataset_id, user_id)
                )
                dataset = cursor.fetchone()
                return dict(dataset) if dataset else None
        except sqlite3.Error as e:
            raise APIError(f"An error occurred while fetching the dataset: {e}", status_code=500, response_json=None)
        finally:
            conn.close()

    def delete_dataset(self, dataset_id, user_id):
        conn = self.connect()
        try:
            with conn:
                cursor = conn.cursor()
                # First get the file path to delete the physical file
                dataset = self.get_dataset_by_id(dataset_id, user_id)
                if not dataset:
                    raise APIError("Dataset not found", status_code=404, response_json=None)
                
                file_path = dataset['file_path']
                cursor.execute(
                    "DELETE FROM datasets WHERE id = ? AND user_id = ?",
                    (dataset_id, user_id)
                )
                
                # Delete the physical file
                if os.path.exists(file_path):
                    os.remove(file_path)
                
                return True
        except sqlite3.Error as e:
            raise APIError(f"An error occurred while deleting the dataset: {e}", status_code=500, response_json=None)
        finally:
            conn.close()

