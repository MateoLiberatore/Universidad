import io
import json
import pandas as pd
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from src.utils.error_handler import APIError

def make_export(raw_json: str, fmt: str):
    try:
        data = json.loads(raw_json)
        columns = data["columns"]
        rows = data["rows"]
    except:
        raise APIError("Datos inválidos.", 400)

    df = pd.DataFrame(rows, columns=columns)
    fmt = fmt.lower()

    if fmt == "csv":
        return _csv(df)
    if fmt == "xlsx":
        return _xlsx(df)
    if fmt == "json":
        return _json(columns, rows)
    if fmt == "pdf":
        return _pdf(df)

    raise APIError("Formato no soportado.", 400)

def _csv(df):
    buf = io.StringIO()
    df.to_csv(buf, index=False)
    return buf.getvalue().encode("utf-8"), "text/csv", "resultado.csv"

def _xlsx(df):
    buf = io.BytesIO()
    with pd.ExcelWriter(buf, engine="openpyxl") as writer:
        df.to_excel(writer, index=False)
    buf.seek(0)
    return buf.read(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "resultado.xlsx"

def _json(columns, rows):
    content = json.dumps({"columns": columns, "rows": rows}, ensure_ascii=False).encode("utf-8")
    return content, "application/json", "resultado.json"

def _pdf(df):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    data = [list(df.columns)] + df.values.tolist()
    table = Table(data, repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#064e3b")),
        ("TEXTCOLOR", (0,0), (-1,0), colors.white),
        ("BACKGROUND", (0,1), (-1,-1), colors.HexColor("#020617")),
        ("TEXTCOLOR", (0,1), (-1,-1), colors.white),
        ("GRID", (0,0), (-1,-1), 0.25, colors.gray)
    ]))
    doc.build([table])
    buffer.seek(0)
    return buffer.read(), "application/pdf", "resultado.pdf"
