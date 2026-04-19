from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from datetime import datetime
from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader
import os
from middleware.auth_middleware import get_current_user
from agents.agent_registry import AGENTS

router = APIRouter()

env = Environment(loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), "../pdf/templates")))

AGENT_TEMPLATES = {
    "A1": "tax_report.html",
    "A3": "notice_reply.html",
    "A7": "deal_review.html",
}

class PDFRequest(BaseModel):
    agent_id: str
    conversation_id: str = None
    title: str = "Tax Planning Report"
    content: str

@router.post("/generate-pdf")
async def create_pdf(req: PDFRequest, user=Depends(get_current_user)):
    template_name = AGENT_TEMPLATES.get(req.agent_id, "tax_report.html")
    agent_name = AGENTS.get(req.agent_id, {}).get("name", "Supreme Tax")

    try:
        template = env.get_template(template_name)
    except Exception:
        template = env.get_template("tax_report.html")

    html_content = template.render(
        title=req.title,
        content=req.content,
        user_name=user.get("full_name", "Client"),
        generated_date=datetime.now().strftime("%d %B %Y"),
        agent_name=agent_name,
        disclaimer="This report is for advisory purposes only. Not a substitute for professional CA advice."
    )

    pdf_bytes = HTML(string=html_content, base_url=".").write_pdf()

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=supreme-tax-{req.agent_id}-report.pdf"}
    )
