import logging
from flask_mail import Message

from server import mail

logger = logging.getLogger(__name__)

DEFAULT_SENDER = "no-reply@mediacloud.org"


def send_html_email(subject, recipients, text_body, html_body):
    msg = Message(_prefix_subject_line(subject),
                  sender=DEFAULT_SENDER,
                  recipients=recipients)
    msg.body = text_body
    msg.html = html_body
    mail.send(msg)


def send_email(sender, recipients, subject, message):
    logger.debug('Sending mail '+sender+':'+subject)
    msg = Message(_prefix_subject_line(subject),
                  sender=sender,
                  recipients=recipients)
    msg.body = message
    mail.send(msg)


def _prefix_subject_line(subject):
    return "[Media Cloud] {}".format(subject)
