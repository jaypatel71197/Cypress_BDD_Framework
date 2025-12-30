import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import UserLoginPage from "../../../pages/auth/userLoginPage";
import HomePage from "../../../pages/homePage";
import SearchPage from "../../../pages/searchPage";
import AddToCartPage from "../../../pages/topHeaders/addToCartPage";
import ProductDetailsPage from "../../../pages/productDetailsPage";
import CheckoutPage from "../../../pages/checkoutPage";
import ConfirmOrderPage from "../../../pages/confirmOrderPage";
import AddressDataFactory from "../../../dataFactory/addressDataFactory";
import { endPoints } from "../../../constant/urlEndPoints";

const loginPage = new UserLoginPage();
const homePage = new HomePage();
const searchPage = new SearchPage();
const addToCartPage = new AddToCartPage();
const productDetailsPage = new ProductDetailsPage();
const checkoutPage = new CheckoutPage();
const confirmOrderPage = new ConfirmOrderPage();

let productDetails = {};
let addressData = {};
let searchableProductTitle = "";

Given("user is logged in", () => {
    cy.fixture("loginUser").then((user) => {
        loginPage.navigate(endPoints.login);
        loginPage.login(user.email, user.password);
    });
});

Given("user searches for {string} product", (searchTerm) => {
    homePage.enterSearchText(searchTerm);
    homePage.clickOnSearchButton();
    cy.wait(2000);
});

Given("user filters by in stock items", () => {
    searchPage.clickOnInStockLabel();
    cy.wait(3000);
});

When("user selects a random product from search results", () => {
    searchPage.clickOnProduct();
});

When("user gets product details from product page", () => {
    productDetailsPage.getProductDetails().then(details => {
        productDetails = details;
        searchableProductTitle = details.title.replace(/\s+/g, " ").trim().toLowerCase();
    });
});

When("user adds product to cart from product page", () => {
    productDetailsPage.clickOnAddToCart();
});

When("user clicks on the cart icon", () => {
    cy.wait(2000);
    homePage.clickOnCartIcon();
    cy.wait(1000);
});

When("user clicks on the checkout button", () => {
    addToCartPage.clickOnCheckoutButton();
    cy.wait(1000);
});

When("user clicks on buy now button", () => {
    productDetailsPage.clickOnBuyNow();
    cy.wait(1000);
});

When("user adds new address", () => {
    checkoutPage.clickOnAddNewAddress();
});

When("user fills address form with valid data", () => {
    addressData = AddressDataFactory.getData();
    checkoutPage.fillAddressForm(addressData);
});

When("user agrees to the terms and conditions", () => {
    checkoutPage.agreeToTerms();
});

When("user clicks continue button", () => {
    checkoutPage.clickOnContinueButton();
});

When("user confirms the order", () => {
    confirmOrderPage.clickOnConfirmOrderButton();
    cy.wait(1000);
});

Then("product name and price should match in checkout page", () => {
    checkoutPage.getCheckoutProducts().then(checkoutProducts => {
        const checkoutProduct = checkoutProducts.find(productRow => {
            if (!productRow.productName) {
                return false;
            }
            const searchableCheckoutTitle = productRow.productName.replace(/\s+/g, " ").trim().toLowerCase();
            return searchableCheckoutTitle.includes(searchableProductTitle);
        });

        expect(checkoutProduct, "Product should exist in checkout").to.not.be.undefined;
        expect(checkoutProduct.productName).to.include(productDetails.title);
        expect(checkoutProduct.unitPrice).to.include(productDetails.price);
    });
});

Then("product name and price should match in confirm order page", () => {
    confirmOrderPage.getConfirmOrderSummary().then(({ products }) => {
        const confirmProduct = products.find(productRow => {
            if (!productRow.productName) {
                return false;
            }
            const searchableConfirmTitle = productRow.productName.replace(/\s+/g, " ").trim().toLowerCase();
            return searchableConfirmTitle.includes(searchableProductTitle);
        });

        expect(confirmProduct, "Product should exist in confirm order").to.not.be.undefined;
        expect(confirmProduct.productName).to.include(productDetails.title);
        expect(confirmProduct.unitPrice).to.include(productDetails.price);
    });
});

Then("total price should be calculated correctly", () => {
    confirmOrderPage.getConfirmOrderSummary().then(({ products, summary }) => {
        const totalSummaryRows = summary.filter(row => row.label.toLowerCase().includes("total"));
        expect(totalSummaryRows.length, "Should have at least one total row").to.be.greaterThan(0);
        const grandTotalRow = totalSummaryRows[totalSummaryRows.length - 1];

        const calculatedProductSubtotal = products.reduce((sum, productRow) => sum + productRow.totalPriceValue, 0);

        const shippingSummaryRow = summary.find(row => row.label.toLowerCase().includes("shipping"));
        const shippingCost = shippingSummaryRow ? shippingSummaryRow.valueNumber : 0;
        const expectedOrderTotal = calculatedProductSubtotal + shippingCost;

        expect(Number(grandTotalRow.value.replace(/[^0-9.-]/g, "")), "Total price should match expected").to.equal(expectedOrderTotal);
    });
});

Then("payment address details should match", () => {
    confirmOrderPage.getPaymentAddressDetails().then(paymentAddressDetails => {
        const expectedAddressLines = [
            `${addressData.firstName} ${addressData.lastName}`,
            addressData.company,
            addressData.address1
        ];

        if (addressData.address2 && addressData.address2.trim().length) {
            expectedAddressLines.push(addressData.address2);
        }

        expectedAddressLines.push(`${addressData.city} ${addressData.postCode}`);
        expectedAddressLines.push(`${addressData.state},${addressData.country}`);

        const formatAddressLine = value => confirmOrderPage.normalizeText(value);

        expectedAddressLines.forEach(expectedLine => {
            const formattedExpectedLine = formatAddressLine(expectedLine);
            expect(paymentAddressDetails.lines).to.include(formattedExpectedLine);
        });
    });
});

Then("order placed message should be displayed", () => {
    cy.contains(" Your order has been placed!").should("be.visible");
});

Then("terms and conditions warning should be visible", () => {
    checkoutPage.getTermsCheckboxAlertMessage().should("be.visible").and("contain", "Warning");
});
