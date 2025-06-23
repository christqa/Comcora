from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from Pages.BasePage import BasePage
import allure
import json

class MainPage(BasePage):
    image_logo_selector = (By.XPATH, "/html/body/div[1]/div/div[1]/aside/div/div/header/img")
    new_contact=(By.XPATH,"/html/body/div[1]/div/div[1]/main/div/div/div/div/div[3]/div[3]/a[1]/button/div[1]/div")
    ACTIVE_CLASS_NAME = "bg-fill-primary-inverse"

    def __init__(self, browser):
        super().__init__(browser)
        self.browser = browser

        # Универсальные локаторы меню
        self.menu_locators = {
            "home": (By.LINK_TEXT, "Home"),
            "payments": (By.LINK_TEXT, "Payments"),
            "history": (By.LINK_TEXT, "History"),
            # "contact bank": (By.LINK_TEXT, "Contact bank"),  # опционально
        }

    def open(self):
        self.browser.get(MAIN_PAGE_URL)

    # ===== Menu Button Methods =====
    def is_menu_button_active(self, name):
        locator = self.menu_locators[name.lower()]
        wait = WebDriverWait(self.browser, 10)
        button = wait.until(EC.visibility_of_element_located(locator))
        classes = button.get_attribute("class")
        return self.ACTIVE_CLASS_NAME in classes

    def is_menu_item_displayed(self, name):
        locator = self.menu_locators[name.lower()]
        wait = WebDriverWait(self.browser, 20)
        button = wait.until(EC.visibility_of_element_located(locator))
        return button.is_displayed()

    # ===== Logo Methods =====
    def image_logo(self):
        return self.find(*self.image_logo_selector)

    @allure.step("logo_is_displayed")
    def image_logo_is_displayed(self):
        wait = WebDriverWait(self.browser, 20)
        wait.until(EC.visibility_of_element_located(self.image_logo_selector))
        return self.image_logo().is_displayed()

    def new_contact_button(self):
        return self.find(*self.new_contact)

    def test_new_contact_button_nav(self):
        WebDriverWait(self.browser, 10).until(
            EC.visibility_of_element_located(self.new_contact)

        )

        button = self.new_contact_button()
        if button.is_displayed():
         button.click()
         return True
        else:
         return False