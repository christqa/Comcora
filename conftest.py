import subprocess
import shutil
import tempfile
import pytest
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.edge.options import Options as EdgeOptions
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from config import (
    VALID_TEST_PASSWORD, VALID_TEST_PIN, VALID_TEST_USERNAME,
    INVALID_TEST_PASSWORD, INVALID_TEST_PIN, INVALID_TEST_USERNAME,
    BASE_URL, BROWSER, HEADLESS, IMPLICIT_WAIT
)

@pytest.fixture(scope="function")
def browser():
    # Убиваем оставшиеся процессы
    subprocess.run(["pkill", "-f", "chrome"], check=False)
    subprocess.run(["pkill", "-f", "chromedriver"], check=False)
    subprocess.run(["pkill", "-f", "msedgedriver"], check=False)
    subprocess.run(["pkill", "-f", "MicrosoftEdge"], check=False)

    # создаём уникальную папку для профиля
    profile_dir = tempfile.mkdtemp(prefix="browser_profile_")
    try:
        if BROWSER.lower() == "edge":
            options = EdgeOptions()
            options.use_chromium = True
            if HEADLESS:
                options.add_argument("--headless")
                options.add_argument("--disable-gpu")
                options.add_argument("--no-sandbox")
                options.add_argument("--disable-dev-shm-usage")
                options.add_argument("--window-size=1920,1080")
            options.add_argument(f"--user-data-dir={profile_dir}")
            service = EdgeService(executable_path="/usr/local/bin/msedgedriver")
            driver = webdriver.Edge(service=service, options=options)
        else:
            # fallback to Chrome
            options = webdriver.ChromeOptions()
            if HEADLESS:
                options.add_argument("--headless")
                options.add_argument("--no-sandbox")
                options.add_argument("--disable-dev-shm-usage")
                options.add_argument("--disable-gpu")
                options.add_argument("--window-size=1920,1080")
            options.add_argument(f"--user-data-dir={profile_dir}")
            service = ChromeService(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=options)

        driver.implicitly_wait(IMPLICIT_WAIT)
        driver.get(BASE_URL)
        yield driver
    finally:
        try:
            driver.quit()
        except Exception:
            pass
        shutil.rmtree(profile_dir, ignore_errors=True)

@pytest.fixture(scope="function")
def login(request, browser):
    """
    Фикстура логина: режимы 'valid' / 'invalid'.
    Использование: @pytest.mark.parametrize("login", ["valid","invalid"], indirect=True)
    """
    actions = ActionChains(browser)
    actions.send_keys(Keys.ESCAPE).perform()
    actions.send_keys("thisisunsafe").perform()

    username_input = browser.find_element(By.NAME, "username")
    password_input = browser.find_element(By.NAME, "personalCode")

    # очищаем поля
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

    mode = getattr(request, 'param', 'valid')
    if mode == 'valid':
        username, password = VALID_TEST_USERNAME, VALID_TEST_PASSWORD
    else:
        username, password = INVALID_TEST_USERNAME, INVALID_TEST_PASSWORD

    username_input.send_keys(username)
    password_input.send_keys(password)

    browser.find_element(By.CSS_SELECTOR, ".gap-x-2.rounded-2xl.py-4.px-0").click()
    if mode == 'valid':
        time.sleep(5)
        browser.find_element(By.CSS_SELECTOR, "#\\:r0\\:-form-item").send_keys(VALID_TEST_PIN)
        browser.find_element(
            By.CSS_SELECTOR,
            "#radix-\\:r1\\: > div > div.flex.flex-col.gap-x-4 > button"
        ).click()
