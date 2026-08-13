let pyodideInstance = null;

export async function initPyodide() {
  if (pyodideInstance) return pyodideInstance;

  if (!window.loadPyodide) {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
    document.head.appendChild(script);
    await new Promise((resolve) => (script.onload = resolve));
  }

  pyodideInstance = await window.loadPyodide();
  await pyodideInstance.loadPackage("micropip");
  
  const micropip = pyodideInstance.pyimport("micropip");
  await micropip.install("reportlab");

  return pyodideInstance;
}

export async function generateInvoicePDF(formData) {
  const pyodide = await initPyodide();
  const payload = JSON.stringify(formData);

  const pythonScript = `
import json
import base64
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.graphics.shapes import Drawing, Rect

data = json.loads('''${payload.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}''')

def draw_dark_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(colors.HexColor("#0A0B0D"))
    canvas.rect(0, 0, letter[0], letter[1], fill=True, stroke=False)
    canvas.restoreState()

def create_monogram_logo(size=36):
    """Draws your custom geometry logo via ReportLab Drawing shapes."""
    d = Drawing(size, size)
    scale = size / 400.0
    
    # White 'P' geometry
    d.add(Rect(80 * scale, (400 - 80 - 40) * scale, 240 * scale, 40 * scale, fillColor=colors.HexColor("#FFFFFF"), strokeColor=None))
    d.add(Rect(180 * scale, (400 - 80 - 240) * scale, 40 * scale, 240 * scale, fillColor=colors.HexColor("#FFFFFF"), strokeColor=None))
    
    # Orange 'E' geometry
    d.add(Rect(220 * scale, (400 - 120 - 40) * scale, 100 * scale, 40 * scale, fillColor=colors.HexColor("#E8724A"), strokeColor=None))
    d.add(Rect(280 * scale, (400 - 160 - 80) * scale, 40 * scale, 80 * scale, fillColor=colors.HexColor("#E8724A"), strokeColor=None))
    d.add(Rect(220 * scale, (400 - 240 - 40) * scale, 100 * scale, 40 * scale, fillColor=colors.HexColor("#E8724A"), strokeColor=None))
    
    return d

pdf_buffer = BytesIO()
doc = SimpleDocTemplate(pdf_buffer, pagesize=letter, leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)

ORANGE = colors.HexColor("#E8724A")
TEXT_WHITE = colors.HexColor("#FFFFFF")
TEXT_MUTED = colors.HexColor("#7E848F")
CARD_BG = colors.HexColor("#131417")
CARD_BORDER = colors.HexColor("#22242A")

styles = getSampleStyleSheet()

title_style = ParagraphStyle('DocTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=28, leading=32, textColor=ORANGE, alignment=2)
meta_label = ParagraphStyle('MetaLabel', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.5, leading=11, textColor=TEXT_MUTED)
meta_val = ParagraphStyle('MetaVal', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=TEXT_WHITE, alignment=2)
meta_val_orange = ParagraphStyle('MetaValO', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=ORANGE, alignment=2)

brand_title = ParagraphStyle('BrandTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=15, leading=19, textColor=TEXT_WHITE)
brand_sub = ParagraphStyle('BrandSub', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=12, textColor=ORANGE)

card_label = ParagraphStyle('CardLabel', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.5, leading=10, textColor=ORANGE)
card_label_muted = ParagraphStyle('CardLabelM', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.5, leading=10, textColor=TEXT_MUTED)

body_white = ParagraphStyle('BodyW', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=13, textColor=TEXT_WHITE)
body_muted = ParagraphStyle('BodyM', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=12, textColor=TEXT_MUTED)

table_header = ParagraphStyle('TH', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.5, leading=10, textColor=TEXT_MUTED)
table_header_r = ParagraphStyle('THR', parent=table_header, alignment=2)

story = []

# 1. Header Section
left_header = [
    [create_monogram_logo(40)],
    [Spacer(1, 4)],
    [Paragraph(data['devName'], brand_title)],
    [Paragraph(data['devTitle'], brand_sub)]
]
left_table = Table(left_header, colWidths=[200])
left_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0)]))

meta_grid = [
    [Paragraph("INVOICE", title_style), Paragraph("", title_style)],
    [Paragraph("INVOICE #", meta_label), Paragraph(data['invoiceNumber'], meta_val)],
    [Paragraph("ISSUE DATE", meta_label), Paragraph(data['issueDate'], meta_val)],
    [Paragraph("DUE DATE", meta_label), Paragraph(data['dueDate'], meta_val_orange)]
]
right_table = Table(meta_grid, colWidths=[150, 100])
right_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('BOTTOMPADDING', (0,0), (-1,-1), 2), ('SPAN', (0,0), (1,0))]))

header_wrapper = Table([[left_table, right_table]], colWidths=[290, 250])
header_wrapper.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0)]))
story.append(header_wrapper)
story.append(Spacer(1, 22))

# 2. Addresses Section
from_body = f"<b>{data['devCompany']}</b><br/><font color='#7E848F'>{data['devEmail']}<br/>{data['devPhone']}<br/>{data['devWebsite']}<br/>{data['devAddress']}</font>"
bill_body = f"<b>{data['clientName']}</b><br/><font color='#7E848F'>{data['clientEmail']}<br/>{data['clientPhone']}<br/>{data['clientWebsite']}<br/>{data['clientAddress']}</font>"

from_card = Table([[Paragraph("FROM", card_label)], [Spacer(1, 2)], [Paragraph(from_body, body_white)]], colWidths=[255])
from_card.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), CARD_BG), ('BOX', (0,0), (-1,-1), 0.5, CARD_BORDER), ('PADDING', (0,0), (-1,-1), 12), ('VALIGN', (0,0), (-1,-1), 'TOP')]))

bill_card = Table([[Paragraph("BILL TO", card_label_muted)], [Spacer(1, 2)], [Paragraph(bill_body, body_white)]], colWidths=[255])
bill_card.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), CARD_BG), ('BOX', (0,0), (-1,-1), 0.5, CARD_BORDER), ('PADDING', (0,0), (-1,-1), 12), ('VALIGN', (0,0), (-1,-1), 'TOP')]))

addr_wrapper = Table([[from_card, bill_card]], colWidths=[265, 265])
addr_wrapper.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0)]))
story.append(addr_wrapper)
story.append(Spacer(1, 22))

# 3. Line Items Section
item_headers = [[Paragraph("DESCRIPTION", table_header), Paragraph("QTY", table_header), Paragraph("RATE", table_header), Paragraph("AMOUNT", table_header_r)]]
items_head_table = Table(item_headers, colWidths=[280, 50, 80, 110])
items_head_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('LEFTPADDING', (0,0), (-1,-1), 12)]))
story.append(items_head_table)
story.append(Spacer(1, 6))

subtotal = 0
currency_symbol = data.get('currency', '$')

for item in data['items']:
    amt = float(item['qty']) * float(item['rate'])
    subtotal += amt
    row_data = [[
        Paragraph(item['description'], body_white),
        Paragraph(str(item['qty']), body_white),
        Paragraph(f"{currency_symbol}{float(item['rate']):,.2f}", body_white),
        Paragraph(f"<b>{currency_symbol}{amt:,.2f}</b>", ParagraphStyle('R', parent=body_white, textColor=ORANGE, alignment=2))
    ]]
    row_table = Table(row_data, colWidths=[280, 50, 80, 110])
    row_table.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), CARD_BG), ('BOX', (0,0), (-1,-1), 0.5, CARD_BORDER), ('PADDING', (0,0), (-1,-1), 10), ('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
    story.append(row_table)
    story.append(Spacer(1, 6))

story.append(Spacer(1, 10))

# 4. Totals Breakdown
tax_amt = subtotal * (float(data['taxRate']) / 100)
total_due = subtotal + tax_amt

totals_data = [
    [Paragraph("Subtotal", ParagraphStyle('SubT', parent=body_muted, alignment=2)), Paragraph(f"{currency_symbol}{subtotal:,.2f}", ParagraphStyle('SubV', parent=body_white, alignment=2))],
    [Paragraph(f"Tax ({data['taxRate']} %)", ParagraphStyle('SubT', parent=body_muted, alignment=2)), Paragraph(f"{currency_symbol}{tax_amt:,.2f}", ParagraphStyle('SubV', parent=body_white, alignment=2))],
    [Paragraph("Total Due", ParagraphStyle('TotT', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=TEXT_WHITE, alignment=2)), Paragraph(f"{currency_symbol}{total_due:,.2f}", ParagraphStyle('TotV', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=ORANGE, alignment=2))]
]
totals_table = Table(totals_data, colWidths=[420, 110])
totals_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('BOTTOMPADDING', (0,0), (-1,-1), 4), ('LINEABOVE', (0,2), (-1,2), 0.5, CARD_BORDER), ('TOPPADDING', (0,2), (-1,2), 8)]))
story.append(totals_table)
story.append(Spacer(1, 20))

# 5. Nigerian Payment Details & Notes Cards
pay_body = f"Bank &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{data['bankName']}</b><br/>Account Name &nbsp;&nbsp;<b>{data['accountName']}</b><br/>Account No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{data['bankAccount']}</b>"
if data.get('paypalEmail'):
    pay_body += f"<br/>PayPal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{data['paypalEmail']}</b>"

pay_card = Table([[Paragraph("PAYMENT DETAILS", card_label)], [Spacer(1, 2)], [Paragraph(pay_body, body_muted)]], colWidths=[255])
pay_card.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), CARD_BG), ('BOX', (0,0), (-1,-1), 0.5, CARD_BORDER), ('PADDING', (0,0), (-1,-1), 12), ('VALIGN', (0,0), (-1,-1), 'TOP')]))

notes_card = Table([[Paragraph("NOTES", card_label_muted)], [Spacer(1, 2)], [Paragraph(data['notes'].replace('\\n', '<br/>'), body_muted)]], colWidths=[255])
notes_card.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), CARD_BG), ('BOX', (0,0), (-1,-1), 0.5, CARD_BORDER), ('PADDING', (0,0), (-1,-1), 12), ('VALIGN', (0,0), (-1,-1), 'TOP')]))

bottom_wrapper = Table([[pay_card, notes_card]], colWidths=[265, 265])
bottom_wrapper.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0)]))
story.append(bottom_wrapper)
story.append(Spacer(1, 22))

# 6. Bottom Brand Bar
footer_left = Table([[create_monogram_logo(20), Paragraph(f"{data['devName']} — {data['devTitle']}", body_muted)]], colWidths=[24, 200])
footer_left.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('LEFTPADDING', (0,0), (-1,-1), 0)]))
footer_right = Paragraph(f"{data['devWebsite']} · {data['devEmail']}", ParagraphStyle('FR', parent=body_muted, alignment=2))

footer_table = Table([[footer_left, footer_right]], colWidths=[265, 265])
footer_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('LINEABOVE', (0,0), (-1,-1), 0.5, CARD_BORDER), ('TOPPADDING', (0,0), (-1,-1), 10), ('LEFTPADDING', (0,0), (-1,-1), 0)]))
story.append(footer_table)

doc.build(story, onFirstPage=draw_dark_background, onLaterPages=draw_dark_background)

pdf_base64 = base64.b64encode(pdf_buffer.getvalue()).decode('utf-8')
pdf_base64
`;

  const resultBase64 = await pyodide.runPythonAsync(pythonScript);
  return resultBase64;
}