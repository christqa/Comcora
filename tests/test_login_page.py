import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from Pages.LoginPage import LoginPage
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import allure


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

#def test_dashboard_elements(login):
    #driver = login  # This is the logged-in browser session
    #assert driver.find_element(By.ID, '/:r61:/-form-item').is_displayed()
    #time.sleep(20)
    #expected_url = "https://comcora.dev/en/private"
    #assert driver.current_url == expected_url, f"Expected URL to be {expected_url}, but got {driver.current_url}"


def test_button1_clicked(browser):
    browser.find_element(By.XPATH, "/html/body/form/button[1]").click()
    expected_url = "https://comcora.dev/en/private/contacts/new-contact"
    assert driver.current_url == expected_url, f"Expected URL to be {expected_url}, but got {driver.current_url}"


#@allure.feature("Login")
#@allure.story("Valid login")
#@allure.severity(allure.severity_level.CRITICAL)
#def test_valid_login(login, browser):
    # Confirm dashboard or some element that's only visible after login
    #assert "Comcora bank" in browser.title, "Valid login did not redirect to dashboard"

#@allure.feature("Login")
#@allure.story("Invalid login")
#@allure.severity(allure.severity_level.CRITICAL)
#@pytest.mark.parametrize("login", ["invalid"], indirect=True)
#def test_invalid_login(login, browser):
    #try:
        # Wait for the error popup to appear
        #WebDriverWait(browser, 20).until(
            #EC.presence_of_element_located((By.XPATH, "/html/body/div[5]/div/div[2]/button"))
        #)
        # Alternatively use a CSS selector or another method
    #except Exception as e:
        #pytest.fail(f"Error during invalid login or pop-up not found: {e}")