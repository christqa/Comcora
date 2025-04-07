import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import  Options

@pytest.fixture(scope="function")
def browser():
    options=Options()
    options.add_argument('--headless')
    driver = webdriver.Chrome(options=options)  # Or use webdriver.Firefox() if needed
    driver.implicitly_wait(30)
    yield driver
    driver.quit()