from Pages.MainPage import MainPage
import pytest
from config import MAIN_PAGE_URL
import allure


#@pytest.mark.regression
def test_login_succesfull(login):
    browser=login # Using login fixture to get an authenticated browser
    browser.get(MAIN_PAGE_URL)
    expected_url = MAIN_PAGE_URL
    assert browser.current_url == expected_url, f"Expected URL to be {expected_url}, but got {browser.current_url}"


def test_logo_present(login):
    main_page = MainPage(login)
    assert main_page.image_logo().is_displayed()

@allure.feature("Menu")
@allure.story("button active")
@allure.severity(allure.severity_level.CRITICAL)
def test_Home_menu_button_isActive(login):
    with allure.step('dashboard is displayed'):
     main_page = MainPage(login)
    with allure.step('home item is active'):
     assert main_page.is_menu_button_active("home"), "Home menu button is not active on the Home page"

@allure.feature("Menu")
@allure.story("button active")
@allure.severity(allure.severity_level.CRITICAL)
def test_Payments_menu_button_isActive(login):
    main_page = MainPage(login)
    assert not main_page.is_menu_button_active("payments"), "Payments menu button is not active on the Home page"

@allure.feature("Menu")
@allure.story("button active")
@allure.severity(allure.severity_level.CRITICAL)
def test_History_menu_button_isActive(login):
    main_page = MainPage(login)
    assert not main_page.is_menu_button_active("history"), "History menu button is not active on the Home page"

@allure.feature("Menu")
@allure.story("button displayed")
@allure.severity(allure.severity_level.CRITICAL)
def test_Payment_menuItem_present(login):
    main_page = MainPage(login)
    assert main_page.is_menu_item_displayed("payments")

@allure.feature("Menu")
@allure.story("Menu item visibility")
@allure.severity(allure.severity_level.CRITICAL)
@pytest.mark.parametrize(
    "menu_item",
    ["home", "payments", "history"],
    ids=["Home Displayed", "Payments Displayed", "History Displayed"]
)
def test_menu_item_is_displayed(login, menu_item):
    main_page = MainPage(login)
    assert main_page.is_menu_item_displayed(menu_item), f"{menu_item.capitalize()} menu item is not displayed"








