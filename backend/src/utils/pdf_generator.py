from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from io import BytesIO
import json

def generate_pdf_from_data(data, title="Análisis Bibliométrico"):
    """Generate PDF from structured data (list of dicts or JSON)"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        textColor=colors.HexColor('#1a1a1a'),
        spaceAfter=30,
        alignment=1  # Center alignment
    )
    
    # Add title
    elements.append(Paragraph(title, title_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Parse data if it's a JSON string
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except json.JSONDecodeError:
            # If it's not JSON, try to parse as table format
            data = _parse_table_data(data)
    
    if isinstance(data, list) and len(data) > 0:
        # Convert list of dicts to table
        if isinstance(data[0], dict):
            table_data = _dict_list_to_table(data)
        else:
            table_data = data
    elif isinstance(data, dict):
        # Single row
        table_data = _dict_to_table(data)
    else:
        # Fallback: treat as string
        elements.append(Paragraph(str(data), styles['Normal']))
        doc.build(elements)
        buffer.seek(0)
        return buffer
    
    # Create table
    table = Table(table_data)
    
    # Add style to table
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    elements.append(table)
    doc.build(elements)
    buffer.seek(0)
    return buffer

def _dict_list_to_table(data):
    """Convert list of dictionaries to table format"""
    if not data:
        return [['No data']]
    
    # Get headers from first dict
    headers = list(data[0].keys())
    table = [headers]
    
    # Add rows
    for row in data:
        table.append([str(row.get(header, '')) for header in headers])
    
    return table

def _dict_to_table(data):
    """Convert single dictionary to table format"""
    table = []
    for key, value in data.items():
        table.append([str(key), str(value)])
    return table

def _parse_table_data(data_str):
    """Try to parse table-like string data"""
    lines = data_str.strip().split('\n')
    if len(lines) < 2:
        return [['No data']]
    
    # Assume first line is header
    headers = [h.strip() for h in lines[0].split('|') if h.strip()]
    table = [headers]
    
    # Parse rows
    for line in lines[1:]:
        if '|' in line:
            row = [cell.strip() for cell in line.split('|') if cell.strip()]
            if len(row) == len(headers):
                table.append(row)
    
    return table

