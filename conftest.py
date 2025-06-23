import pytest
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from config import (
    VALID_TEST_PASSWORD, VALID_TEST_PIN, VALID_TEST_USERNAME,
    INVALID_TEST_PASSWORD, INVALID_TEST_PIN, INVALID_TEST_USERNAME,
    BASE_URL, IMPLICIT_WAIT
)

@pytest.fixture(scope="function")
def browser():
    chrome_opts = ChromeOptions()
    #chrome_opts.add_argument("--headless")
    chrome_opts.add_argument("--disable-gpu")
    chrome_opts.add_argument("--window-size=1920,1080")
    chrome_opts.add_argument("--no-sandbox")
    chrome_opts.add_argument("--disable-dev-shm-usage")

    # If chromedriver is in your PATH, no need to specify executable_path
    driver = webdriver.Chrome(options=chrome_opts)
    driver.implicitly_wait(IMPLICIT_WAIT)

    driver.get(f"{BASE_URL}/en")
    yield driver
    driver.quit()


@pytest.fixture(scope="function")
def login(browser):
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

    VALID_TEST_PIN = WebDriverWait(browser, 30).until(
        EC.presence_of_element_located((By.XPATH, '/html/body/div[1]/div/div[2]/div/div/div/div[1]/form/div/div/div[2]/input'))
    )

    VALID_TEST_PIN.send_keys('0000')
    confirm_button=browser.find_element(By.XPATH,
        '/html/body/div[5]/div/div[2]/button')
    confirm_button.click()
    # Optionally wait for login confirmation here (e.g., URL change or element)
    # Example:
    # WebDriverWait(browser, 10).until(EC.url_contains("/dashboard"))

    return browser
