from io import BytesIO
from django.template.loader import get_template
from xhtml2pdf import pisa


def generate_pdf(invoice):
    template = get_template('invoice/pdf_template.html')
    html = template.render({'invoice': invoice})
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
    if not pdf.err:
        return result.getvalue()
    return None
