import time
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from config import BASE_URL, BROWSER, HEADLESS, IMPLICIT_WAIT
from config import VALID_TEST_PASSWORD, VALID_TEST_PIN,VALID_TEST_USERNAME
from config import INVALID_TEST_PASSWORD, INVALID_TEST_PIN,INVALID_TEST_USERNAME
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


@pytest.fixture(scope="function")
def browser():
    options = webdriver.ChromeOptions() if BROWSER == "chrome" else webdriver.FirefoxOptions()

    if HEADLESS:
        options.add_argument("--headless")

    if BROWSER == "chrome":
        browser = webdriver.Chrome(options=options)
    else:
        browser = webdriver.Firefox(options=options)

    browser.implicitly_wait(IMPLICIT_WAIT)
    browser.get(BASE_URL)

    yield browser

    browser.quit()


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
