from typing import Any

import asyncio
import logging
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import aiosmtplib
import html2text
import jinja2

from .config import TEMPLATES_DIR, settings, timezone
from .exceptions import EmailSendingFailedError

logger = logging.getLogger(__name__)

jinja_env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(TEMPLATES_DIR),
    autoescape=jinja2.select_autoescape(["html", "xml"]),
    trim_blocks=True,
    lstrip_blocks=True,
)

smtp_config = {
    "hostname": settings.mail.smtp_host,
    "port": settings.mail.smtp_port,
    "use_tls": settings.mail.smtp_use_tls,
}


def current_datetime() -> datetime:
    """Получение текущего времени"""

    return datetime.now(timezone)


def get_expiration_timestamp(expires_in: timedelta) -> int:
    """Получение и расчёт Unix Timestamp для истечения времени"""

    return int((current_datetime() + expires_in).timestamp())


async def run_cli_command(*args):
    """Запускает CLI команду (в терминале)"""

    process = await asyncio.create_subprocess_exec(
        *args, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await process.communicate()
    stdout_decoded = stdout.decode().strip()
    stderr_decoded = stderr.decode().strip()

    logger.info("[%s exited with %s]", args[0], process.returncode)
    if stdout_decoded:
        logger.info("[stdout]\n%s", stdout_decoded)
    if stderr_decoded:
        logger.error("[stderr]\n%s", stderr_decoded)

    return process.returncode, stdout_decoded, stderr_decoded


async def send_mail(
        to: str | list[str],
        subject: str,
        template_name: str | None = None,
        context: dict[str, Any] | None = None,
        plain_text: str | None = None,
        from_email: str | None = None,
        reply_to: str | None = None,
) -> None:
    """Отправка email письма"""

    from_email = from_email or settings.mail.default_from_email
    recipients = [to] if isinstance(to, list) else to

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = ", ".join(recipients)
    if reply_to is not None:
        msg["Reply-To"] = reply_to

    html_content = None
    if template_name is not None:
        try:
            template = jinja_env.get_template(template_name)
            html_content = template.render(**(context or {}))
        except jinja2.TemplateNotFound as e:
            logger.exception("Template not found")
            raise EmailSendingFailedError(
                f"Template with name '{template_name}' not found!"
            ) from e

    text_content = plain_text
    if text_content is None and html_content is not None:
        converter = html2text.HTML2Text()
        text_content = converter.handle(html_content)
    if text_content is None and html_content is None:
        error_msg = "Neither the template nor the text of the letter is specified!"
        logger.error(error_msg)
        raise ValueError(error_msg)

    if text_content:
        msg.attach(MIMEText(text_content, "plain", "utf-8"))
    if html_content:
        msg.attach(MIMEText(html_content, "html", "utf-8"))

    await aiosmtplib.send(msg, recipients=recipients, sender=from_email, **smtp_config)
