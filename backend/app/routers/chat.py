from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
import re

from app.database import get_db
from app.models import User, ChatMessage
from app.schemas import ChatMessageCreate, ChatMessageResponse
from app.auth import get_current_user

router = APIRouter(prefix="/chat", tags=["AI Chat Assistant"])

@router.post("", response_model=ChatMessageResponse)
def chat_with_code_assistant(
    message_data: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Save User message to DB
    user_msg = ChatMessage(
        user_id=current_user.id,
        role="user",
        content=message_data.content,
        context_code=message_data.context_code
    )
    db.add(user_msg)
    db.commit()
    
    # Process Context & generate context-aware response
    response_content = generate_mock_chat_response(message_data.content, message_data.context_code)
    
    # Save Assistant response to DB
    assistant_msg = ChatMessage(
        user_id=current_user.id,
        role="assistant",
        content=response_content,
        context_code=None
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)
    
    return assistant_msg

def generate_mock_chat_response(prompt: str, code: Optional[str]) -> str:
    prompt_lower = prompt.lower()
    
    # Analyze code context if available
    has_sql_inject = code and re.search(r"execute\s*\(\s*f['\"].*\{\w+\}.*['\"]\s*\)", code)
    has_hardcoded_secret = code and re.search(r"(?i)(api_key|secret|password)\s*=\s*['\"][a-zA-Z0-9_\-]{10,}['\"]", code)
    has_swallowing = code and "except:" in code or "except Exception:" in code
    
    if not code:
        if "hello" in prompt_lower or "hi" in prompt_lower:
            return "Hello! I am your Reviora AI Code Review assistant. Paste a code block in the editor and ask me questions about bugs, optimization, or security!"
        elif "features" in prompt_lower or "what can you do" in prompt_lower:
            return "I can scan your code for bugs, detect security risks like SQL injection or leaked secrets, analyze code smells, generate READMEs and API documentation, and help you refactor code snippets!"
        else:
            return "I'm ready to review your code. Paste a code snippet and ask me to find bugs, explain a logic error, or suggest security fixes!"

    # Code context analysis triggers
    if "bug" in prompt_lower or "error" in prompt_lower or "crash" in prompt_lower:
        if has_swallowing:
            return "### Bug Analysis\nI noticed that you are swallowing exceptions silently on line(s) around the `except` block. This makes it hard to diagnose failures. I suggest adding logging:\n\n```python\nexcept Exception as err:\n    logger.error(f'Failure: {err}')\n    raise\n```"
        return "### Bug Analysis\nLooking at this snippet, the execution flow seems stable. However, ensure that any external inputs or database connections are wrapped in `try/except` blocks to handle network timeouts or missing environment params gracefully."

    elif "security" in prompt_lower or "vulnerability" in prompt_lower or "sql" in prompt_lower:
        if has_sql_inject:
            return "### Security Review: SQL Injection Risk\n\n**CRITICAL**: You are formatting raw variables directly into the query string. An attacker could input SQL commands in the query variable and bypass database logic.\n\n**Remediation**:\nUse parameterized bindings:\n```python\n# Safe implementation\nquery = \"SELECT * FROM users WHERE email = %s\"\ncursor.execute(query, (user_email,))\n```"
        if has_hardcoded_secret:
            return "### Security Review: Hardcoded Secrets\n\n**CRITICAL**: I found a hardcoded secret key/password. If this code is checked into version control, the secret is compromised.\n\n**Remediation**:\nStore it in a `.env` file and load it via `os.getenv` or `process.env`:\n```python\nimport os\nSECRET = os.getenv('MY_SECRET_KEY')\n```"
        return "### Security Review\nNo immediate critical vulnerabilities were matched in this snippet. As a rule, ensure that all HTML output is sanitized to prevent Cross-Site Scripting (XSS) and that no secrets are committed in cleartext."

    elif "smell" in prompt_lower or "refactor" in prompt_lower or "clean" in prompt_lower:
        return "### Refactoring Recommendations\nTo make this code more maintainable, I recommend:\n1. Extracting complex nesting into helper methods.\n2. Writing docstrings describing the input arguments and returned types.\n3. Using descriptive variable names rather than generic names."

    # Default fallback response
    return f"### Code Assistant Response\nI've analyzed the {len(code.splitlines())}-line snippet you provided. \n\nIf you want to focus on a particular issue, ask me:\n- *\"Are there any security vulnerabilities in this code?\"*\n- *\"How can I optimize or refactor this snippet?\"*\n- *\"Find potential bugs or exception handling issues.\"*"
