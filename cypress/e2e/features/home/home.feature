Feature: Home Page Validations

    Background: User searches for a product
        Given user is on the home page
        When user searches for "hp"

    @withoutLogin
    Scenario: Verify add to cart from search results
        When user hovers and clicks on add to cart button
        And user clicks on cart icon
        Then product title and price in cart should match search result

    @withoutLogin
    Scenario: Verify product details page reflects correct product details
        When user clicks on a product from search results
        Then product details page should display correct title and price

    @withoutLogin
    Scenario: Verify quick view from search results
        When user clicks on quick view
        Then quick view should display correct product title and price

    @withLogin
    Scenario: Verify search functionality
        Then search results should contain relevant products

    @withLogin
    Scenario: Verify selected product appears in the wishlist after adding from product details page
        When user clicks on a product from search results
        And user adds product to wishlist
        And user clicks on wishlist icon
        Then product should appear in wishlist with correct details
        When user removes product from wishlist
        Then product should be removed from wishlist

    @withLogin
    Scenario: Verify products details on checkout page
        When user filters by in stock products
        And user clicks on a product from search results
        And user adds product to cart
        And user clicks on cart icon
        And user clicks on checkout button
        Then product details should match on checkout page

    @withLogin
    Scenario: Removes product from checkout and verifies cart summary
        When user filters by in stock products
        And user clicks on a product from search results
        And user adds product to cart
        And user clicks on cart icon
        And user clicks on checkout button
        And user removes product from checkout
        Then cart should be empty or product should be removed

    @withLogin
    Scenario: Verify product name and price in compare table
        When user clicks on a product from search results
        And user clicks on compare product link
        And user clicks on compare icon
        Then product name and price should match in compare table

    @withLogin
    Scenario: Verify remove product from compare and table should disappear
        When user clicks on a product from search results
        And user clicks on compare product link
        And user clicks on compare icon
        And user clicks on remove icon in compare page
        Then compared item should not be visible
        And success alert should be displayed

    @withLogin
    Scenario: Verify product details on checkout page after adding from compare product page
        When user clicks on a product from search results
        And user clicks on compare product link
        And user clicks on compare icon
        And user clicks on add to cart from compare page
        And user clicks on cart icon
        And user clicks on checkout button
        Then product details should match on checkout page
