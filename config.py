# config.py
import os

BASE_URL = os.getenv("BASE_URL", "http://host.docker.internal:8000")
MAIN_PAGE_URL = os.getenv("PRIVATE_PAGE_URL", "https://comcora.dev/en/private")


# Browser configuration
BROWSER = os.getenv("BROWSER", "chrome").lower()  # default to chrome if not set
HEADLESS = os.getenv("HEADLESS", "False").lower() == "true"  # Run headless if set to true

# Timeouts (in seconds)
IMPLICIT_WAIT = 10  # Default implicit wait for elements to appear
EXPLICIT_WAIT = 20  # Default explicit wait for certain conditions

# Login credentials
VALID_TEST_USERNAME = os.getenv("UI_TEST_USERNAME", "smirnov_petr")
VALID_TEST_PASSWORD = os.getenv("UI_TEST_PASSWORD", "30303039816")
VALID_TEST_PIN = os.getenv("UI_TEST_PIN", "0000")

INVALID_TEST_USERNAME = os.getenv("UI_TEST_USERNAME", "smirnoFF_petr")
INVALID_TEST_PASSWORD = os.getenv("UI_TEST_PASSWORD", "3030303981E")
INVALID_TEST_PIN = os.getenv("UI_TEST_PIN", "0000")





# Logging configuration (if you want to set up logging)
#LOGGING_LEVEL = os.getenv("LOGGING_LEVEL", "INFO").upper()

# For screenshots (optional)
#SCREENSHOT_PATH = os.getenv("SCREENSHOT_PATH", "./screenshots")
