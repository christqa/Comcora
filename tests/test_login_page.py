import pytest
from selenium import webdriver
from selenium.webdriver import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from Pages.LoginPage import LoginPage
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from selenium.webdriver.chrome.options import  Options


def test_button1_exist(browser):
    login_page = LoginPage(browser)
    login_page.open()
    # Create an action chain
    actions = ActionChains(browser)

    # Send keys directly to the page
    time.sleep(2)
    actions.send_keys(Keys.ESCAPE).perform()
    actions.send_keys("thisisunsafe").perform()


    assert login_page.button_is_displayed()

def test_button1_clicked(browser):
    browser.find_element(By.XPATH, "/html/body/form/button[1]").click()
    expected_url = "https://comcora.dev/en/private/contacts/new-contact"
    assert driver.current_url == expected_url, f"Expected URL to be {expected_url}, but got {driver.current_url}"