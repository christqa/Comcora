from Pages.base_page import BasePage
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

button_selector = (By.XPATH, "/html/body/div[1]/div/div[2]/div/div/div/div/div[1]/div/div[2]/form/div[2]/button[1]")

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