import logging
import secrets
import string

logger = logging.getLogger(__name__)


def generate_password(password_length: int = 16) -> str:
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return "".join(secrets.choice(alphabet) for _ in range(password_length))


def main() -> None:
    password = generate_password()
    logger.warning("Your password is: %s", password)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
