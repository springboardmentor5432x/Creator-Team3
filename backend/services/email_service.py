import logging

logger = logging.getLogger(__name__)

class EmailService:
    @staticmethod
    def send_report_email(user_email: str, report_name: str, file_path: str = None, download_url: str = None):
        """
        Mock sending a report email.
        """
        logger.info(f"========== EMAIL DISPATCH ==========")
        logger.info(f"To: {user_email}")
        logger.info(f"Subject: Your Scheduled Report is Ready: {report_name}")
        logger.info(f"Body: Hello,\nYour {report_name} has been generated successfully.")
        if file_path:
            logger.info(f"Attachment: {file_path}")
        if download_url:
            logger.info(f"Download Link: {download_url}")
        logger.info(f"====================================")

    @staticmethod
    def send_notification_email(user_email: str, title: str, message: str):
        """
        Mock sending a generic notification/alert email.
        """
        logger.info(f"========== EMAIL DISPATCH ==========")
        logger.info(f"To: {user_email}")
        logger.info(f"Subject: {title}")
        logger.info(f"Body: {message}")
        logger.info(f"====================================")
