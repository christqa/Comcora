import pytest
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options as ChromeOptions

from config import (
    VALID_TEST_PASSWORD, VALID_TEST_PIN, VALID_TEST_USERNAME,
    INVALID_TEST_PASSWORD, INVALID_TEST_PIN, INVALID_TEST_USERNAME,
    BASE_URL, IMPLICIT_WAIT
)

SELENIUM_URL = "http://localhost:4456/wd/hub"

@pytest.fixture(scope="session", autouse=True)
def selenium_container():
    import subprocess

    # Start Selenium container with explicit platform for compatibility (e.g., on M1/M2 Macs)
    subprocess.run([
        'docker', 'run', '-d', '--rm', '--platform', 'linux/arm64', '--shm-size=2g', '-p', '4456:4444', 'selenium/standalone-chromium:latest'
    ])

    # Wait until Selenium is ready (max 30 seconds)
    for _ in range(30):
        try:
            resp = requests.get(f"{SELENIUM_URL}/status")
            if resp.status_code == 200 and resp.json().get("value", {}).get("ready", False):
                break
        except Exception:
            pass
        time.sleep(1)
    else:

        raise RuntimeError("Selenium container didn't become ready in time.")

    yield
    # Container will auto-remove due to --rm flag on docker run

@pytest.fixture(scope="function")
def browser():
    chrome_opts = ChromeOptions()
    chrome_opts.add_argument("--headless")
    chrome_opts.add_argument("--disable-gpu")
    chrome_opts.add_argument("--window-size=1920,1080")
    chrome_opts.add_argument("--no-sandbox")
    chrome_opts.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Remote(
        command_executor=SELENIUM_URL,
        options=chrome_opts
    )
    driver.implicitly_wait(IMPLICIT_WAIT)
    driver.get(BASE_URL)
    yield driver
    driver.quit()


@pytest.fixture(scope="function")
def login(request, browser):
    """
    Login fixture that enters username and password and submits the form.
    Can be extended to support 'valid' or 'invalid' modes by reading a parameter.
    """
    # Dismiss any initial modals or warnings (like "thisisunsafe")
    actions = ActionChains(browser)
    actions.send_keys(Keys.ESCAPE).perform()
    actions.send_keys("thisisunsafe").perform()

    # Locate input fields
    username_input = browser.find_element(By.NAME, "username")
    password_input = browser.find_element(By.NAME, "personalCode")

    # Optional: clear input fields if there are clear buttons
    clear_username_btn = browser.find_element(
        By.XPATH,
        '/html/body/div[1]/div/div[2]/div/div/div/div/div[1]/div/div[2]/form/div[1]/div[1]/div/div/button'
    )
    clear_username_btn.click()

    clear_password_btn = browser.find_element(
        By.XPATH,
        '/html/body/div[1]/div/div[2]/div/div/div/div/div[1]/div/div[2]/form/div[1]/div[2]/div/div/button'
    )
    clear_password_btn.click()

    # Enter valid credentials (you can add logic for invalid ones)
    username_input.send_keys(VALID_TEST_USERNAME)
    password_input.send_keys(VALID_TEST_PASSWORD)

    # Submit the form - adjust selector as per your form structure
    submit_button = browser.find_element(
        By.XPATH,
        '/html/body/div[1]/div/div[2]/div/div/div/div/div[1]/div/div[2]/form/div[2]/button'
    )
    submit_button.click()

    # Wait for some expected post-login element or URL to confirm login success
    # e.g., WebDriverWait(browser, 10).until(EC.url_contains("/dashboard"))

    return browser
