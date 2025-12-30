Feature: User Registration

  Scenario: User registers successfully with valid data
    Given user is on the registration page
    When user fills registration form with valid data
    And user agrees to terms and conditions
    And user submits registration form
    Then user should see registration success message
    When user clicks on continue button
    Then user should be redirected to account dashboard
    And user should see dashboard sections

  Scenario: User sees warning when registering without agreeing to terms
    Given user is on the registration page
    When user fills registration form with valid data
    And user submits registration form
    Then user should see warning alert message
    And user should remain on registration page

  Scenario: User sees warning when registering with existing email
    Given user is on the registration page
    When user fills registration form with existing email
    And user agrees to terms and conditions
    And user submits registration form
    Then user should see warning alert message
    And user should remain on registration page

  Scenario: User sees error when registering without mandatory email field
    Given user is on the registration page
    When user fills registration form without email
    And user agrees to terms and conditions
    And user submits registration form
    Then user should see invalid email alert
    And user should remain on registration page


