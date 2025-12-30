@purchaseProduct
Feature: Purchase Products

  Background:
    Given user is logged in
    And user searches for "hp" product
    And user filters by in stock items

  @purchase @fullPurchase
  Scenario: Verify products name and price in checkout page and purchase product
    When user selects a random product from search results
    And user gets product details from product page
    And user adds product to cart from product page
    And user clicks on the cart icon
    And user clicks on the checkout button
    Then product name and price should match in checkout page
    When user adds new address
    And user fills address form with valid data
    And user agrees to the terms and conditions
    And user clicks continue button
    Then product name and price should match in confirm order page
    And total price should be calculated correctly
    And payment address details should match
    When user confirms the order
    Then order placed message should be displayed

  @purchase @buyNow
  Scenario: Verify products name and price in checkout page using buy now
    When user selects a random product from search results
    And user gets product details from product page
    And user clicks on buy now button
    Then product name and price should match in checkout page
    When user agrees to the terms and conditions
    And user clicks continue button
    Then product name and price should match in confirm order page
    And total price should be calculated correctly

  @purchase @termsAlert
  Scenario: Verify alert message for terms and conditions checkbox
    When user selects a random product from search results
    And user clicks on buy now button
    And user clicks continue button
    Then terms and conditions warning should be visible
