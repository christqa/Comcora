import shutil
import tempfile
import pytest
import time
from selenium import webdriver
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.edge.options import EdgeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from config import (
    VALID_TEST_PASSWORD, VALID_TEST_PIN, VALID_TEST_USERNAME,
    INVALID_TEST_PASSWORD, INVALID_TEST_PIN, INVALID_TEST_USERNAME,
    BASE_URL, BROWSER, HEADLESS, IMPLICIT_WAIT
)

@ pytest.fixture(scope="function")
def browser():
    """
    Фикстура запуска браузера Edge (Chromium) с уникальным профилем.
    """
    # создаём временный каталог для профиля
    profile_dir = tempfile.mkdtemp(prefix="edge_profile_")

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
            # указываем временный профиль
            options.add_argument(f"--user-data-dir={profile_dir}")

            # путь до msedgedriver должен быть в PATH или указан явно
            service = EdgeService(executable_path="/usr/local/bin/msedgedriver")
            driver = webdriver.Edge(service=service, options=options)
        else:
            # fallback to Chrome as before
            from selenium.webdriver.chrome.service import Service as ChromeService
            from webdriver_manager.chrome import ChromeDriverManager
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
        # teardown: закрываем и удаляем профиль
        try:
            driver.quit()
        except Exception:
            pass
        shutil.rmtree(profile_dir, ignore_errors=True)

@pytest.fixture(scope="function")
def login(request, browser):
    """
    Фикстура логина для Edge/Chrome.
    """
    actions = ActionChains(browser)
    actions.send_keys(Keys.ESCAPE).perform()
    actions.send_keys("thisisunsafe").perform()

    user = request.param if hasattr(request, 'param') else 'valid'
    username = VALID_TEST_USERNAME if user == 'valid' else INVALID_TEST_USERNAME
    password = VALID_TEST_PASSWORD if user == 'valid' else INVALID_TEST_PASSWORD

    browser.find_element(By.NAME, "username").send_keys(username)
    browser.find_element(By.NAME, "personalCode").send_keys(password)
    browser.find_element(By.CSS_SELECTOR, ".gap-x-2.rounded-2xl.py-4.px-0").click()

    if user == 'valid':
        time.sleep(5)
        browser.find_element(By.CSS_SELECTOR, "#\\:r0\\:-form-item").send_keys(VALID_TEST_PIN)
        browser.find_element(By.CSS_SELECTOR,
                             "#radix-\\:r1\\: > div > div.flex.flex-col.gap-x-4 > button"
                             ).click()
