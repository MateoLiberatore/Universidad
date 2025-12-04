from typing import List
from werkzeug.datastructures import FileStorage
from PyPDF2 import PdfReader
from docx import Document
from src.utils.error_handler import APIError

def parse_file_storage(file_storage: FileStorage) -> str:
    filename = file_storage.filename or ""
    mimetype = (file_storage.mimetype or "").lower()
    if filename.lower().endswith(".pdf") or "pdf" in mimetype:
        return _parse_pdf(file_storage)
    if filename.lower().endswith(".docx"):
        return _parse_docx(file_storage)
    if filename.lower().endswith(".doc"):
        raise APIError("Formato .doc no soportado.", 400)
    return _parse_text(file_storage)

def _parse_pdf(file_storage: FileStorage) -> str:
    file_storage.stream.seek(0)
    reader = PdfReader(file_storage.stream)
    text_list = []
    for page in reader.pages:
        text_list.append(page.extract_text() or "")
    return "\n".join(text_list)

def _parse_docx(file_storage: FileStorage) -> str:
    file_storage.stream.seek(0)
    doc = Document(file_storage.stream)
    return "\n".join(p.text for p in doc.paragraphs)

def _parse_text(file_storage: FileStorage) -> str:
    file_storage.stream.seek(0)
    content = file_storage.read()
    if isinstance(content, bytes):
        return content.decode("utf-8", errors="ignore")
    return str(content)
