from Pages.BasePage import BasePage
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

button_selector = (By.CSS_SELECTOR, ".gap-x-2.rounded-2xl.py-4.px-0")


class LoginPage(BasePage):

    def open(self):
        self.browser.get("https://comcora.dev/en")

    def __init__(self,browser):
        super().__init__(browser)

    def button(self):
        return self.find(*button_selector)

    def button_is_displayed(self):
        WebDriverWait(self.browser, 10).until(
            EC.visibility_of_element_located(button_selector)
        )
        return self.button().is_displayed()

    def test_dashboard_elements(login):
        driver = login  # This is the logged-in browser session

        # Now do your checks
        assert driver.find_element(By.ID, "welcome-message").is_displayed()


