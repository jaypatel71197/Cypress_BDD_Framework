Feature: User Login

  Scenario: User sees error for invalid email with valid password
    Given user is on the login page
    When user enters invalid email and valid password
    And user clicks on login button
    Then user should see warning alert message
    And user should remain on login page

  Scenario: User sees error for valid email with invalid password
    Given user is on the login page
    When user enters valid email and invalid password
    And user clicks on login button
    Then user should see warning alert message
    And user should remain on login page

  Scenario: User sees error for empty email and password
    Given user is on the login page
    When user clicks on login button
    Then user should see warning alert message
    And user should remain on login page

  Scenario: User logs in successfully with valid credentials
    Given user is on the login page
    When user enters valid email and password
    And user clicks on login button
    Then user should be redirected to account dashboard
    And user should see dashboard sections