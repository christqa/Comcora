import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.remote.webdriver import WebDriver as RemoteWebDriver
from selenium.webdriver.remote.remote_connection import RemoteConnection

from config import (
    VALID_TEST_PASSWORD, VALID_TEST_PIN, VALID_TEST_USERNAME,
    INVALID_TEST_PASSWORD, INVALID_TEST_PIN, INVALID_TEST_USERNAME,
    BASE_URL, IMPLICIT_WAIT
)

SELENIUM_URL = "http://localhost:4444/wd/hub"

@pytest.fixture(scope="session", autouse=True)
def selenium_container():
    # Поднимаем контейнер перед сессией (можно убрать, если запускаете руками)
    import subprocess, time
    subprocess.run([
        "docker", "run", "-d", "--rm",
        "-p", "4444:4444",
        "selenium/standalone-chrome:latest"
    ], check=True)
    # Даем контейнеру время подняться
    time.sleep(5)
    yield
    # Контейнер сам удалится по --rm

@pytest.fixture(scope="function")
def browser():
    chrome_opts = ChromeOptions()
    chrome_opts.add_argument("--headless")
    chrome_opts.add_argument("--disable-gpu")
    chrome_opts.add_argument("--window-size=1920,1080")
    chrome_opts.add_argument("--no-sandbox")
    chrome_opts.add_argument("--disable-dev-shm-usage")

    # Инициализируем удаленный драйвер
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
    """Фикстура логина: режимы 'valid' / 'invalid'."""
    actions = ActionChains(browser)
    actions.send_keys(Keys.ESCAPE).perform()
    actions.send_keys("thisisunsafe").perform()

    username_input = browser.find_element(By.NAME, "username")
    password_input = browser.find_element(By.NAME, "personalCode")

    # очистка полей
    browser.find_element(
        By.XPATH,
        '/html/body/div[1]/div/div[2]/div/div/div/div/div[1]/div/div[2]'
        '/form/div[1]/div[1]/div/div/button'
    ).click()
    browser.find_element(
        By.XPATH,
        '/html/body/div[1]/div/div[2]/div/div/div/div/div[1]/div/div[2]'
        '/form/div[1]/div[2]/div/div/button'
    ).click()

    mode = getattr(request, "param", "valid")
    if mode == "valid":
        username, password = VALID_TEST_USERNAME, VALID_TEST_PASSWORD
    else:
        username, password = INVALID_TEST_USERNAME, INVALID_TEST_PASSWORD

    username_input.send_keys(username)
    password_input.send_keys(password)

    browser.find_element(By.CSS_SELECTOR, ".gap-x-2.rounded-2xl.py-4.px-0").click()

    if mode == "valid":
        time.sleep(5)
        browser.find_element(By.CSS_SELECTOR, "#\\:r0\\:-form-item").send_keys(VALID_TEST_PIN)
        browser.find_element(
            By.CSS_SELECTOR,
            "#radix-\\:r1\\: > div > div.flex.flex-col.gap-x-4 > button"
        ).click()
