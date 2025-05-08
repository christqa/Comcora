import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from config import BASE_URL, BROWSER, HEADLESS, IMPLICIT_WAIT
from config import VALID_TEST_PASSWORD, VALID_TEST_PIN,VALID_TEST_USERNAME
from config import INVALID_TEST_PASSWORD, INVALID_TEST_PIN,INVALID_TEST_USERNAME
from config import BASE_URL, BROWSER, HEADLESS, IMPLICIT_WAIT
import shutil
import tempfile
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager


@pytest.fixture
def browser():
    driver = None

    if BROWSER == "chrome":
        options = webdriver.ChromeOptions()

        if HEADLESS:
            options.add_argument("--headless=new")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")
            options.add_argument("--remote-debugging-port=9222")
            options.add_argument("--window-size=1920,1080")

        # Use temp user data dir to avoid lock conflicts
        temp_profile = tempfile.mkdtemp()
        options.add_argument(f"--user-data-dir={temp_profile}")

        service = ChromeService(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)

    else:  # Fallback to Firefox
        options = webdriver.FirefoxOptions()
        if HEADLESS:
            options.add_argument("--headless")
        service = FirefoxService(GeckoDriverManager().install())
        driver = webdriver.Firefox(service=service, options=options)

    driver.implicitly_wait(IMPLICIT_WAIT)
    driver.get(BASE_URL)
    yield driver
    driver.quit()

@pytest.fixture(scope="function")
def login(request, browser):
    """
    Login fixture that supports valid and invalid credentials via test param.
    Usage: @pytest.mark.parametrize("login", ["valid", "invalid"], indirect=True)
    """
    actions = ActionChains(browser)
    actions.send_keys(Keys.ESCAPE).perform()
    actions.send_keys("thisisunsafe").perform()

    username_input = browser.find_element(By.NAME, "username")
    password_input = browser.find_element(By.NAME, "personalCode")

    # Clear the fields before entering new values
    browser.find_element(By.XPATH, '/html/body/div[1]/div/div[2]/div/div/div/div/div[1]/div/div[2]/form/div[1]/div[1]/div/div/button').click()
    browser.find_element(By.XPATH, '/html/body/div[1]/div/div[2]/div/div/div/div/div[1]/div/div[2]/form/div[1]/div[2]/div/div/button').click()

    mode = request.param if hasattr(request, "param") else "valid"

    if mode == "valid":
        username = VALID_TEST_USERNAME
        password = VALID_TEST_PASSWORD
    else:
        username = INVALID_TEST_USERNAME
        password = INVALID_TEST_PASSWORD

    username_input.send_keys(username)
    password_input.send_keys(password)

    # Click login
    browser.find_element(By.CSS_SELECTOR, ".gap-x-2.rounded-2xl.py-4.px-0").click()

    if mode == "valid":
        time.sleep(5)
        browser.find_element(By.CSS_SELECTOR, "#\\:r0\\:-form-item").send_keys(VALID_TEST_PIN)
        browser.find_element(By.CSS_SELECTOR, "#radix-\\:r1\\: > div > div.flex.flex-col.gap-x-4 > button").click()

    return browser
