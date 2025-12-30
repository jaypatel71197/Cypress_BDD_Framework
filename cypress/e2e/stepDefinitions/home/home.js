import { Given, When, Then, Before } from "@badeball/cypress-cucumber-preprocessor";
import UserLoginPage from "../../../pages/auth/userLoginPage";
import HomePage from "../../../pages/homePage";
import SearchPage from "../../../pages/searchPage";
import AddToCartPage from "../../../pages/topHeaders/addToCartPage";
import ProductDetailsPage from "../../../pages/productDetailsPage";
import CheckoutPage from "../../../pages/checkoutPage";
import WishlistPage from "../../../pages/topHeaders/wishlistPage";
import ProductComparePage from "../../../pages/productComparePage";
import { endPoints } from "../../../constant/urlEndPoints";
import { testText } from "../../../constant/testText";

const loginPage = new UserLoginPage();
const homePage = new HomePage();
const searchPage = new SearchPage();
const addToCartPage = new AddToCartPage();
const productDetailsPage = new ProductDetailsPage();
const checkoutPage = new CheckoutPage();
const wishlistPage = new WishlistPage();
const productComparePage = new ProductComparePage();

let searchProduct = {};
let productDetails = {};

Before({ tags: "@withLogin" }, () => {
    cy.fixture("loginUser").then((user) => {
        loginPage.navigate(endPoints.login);
        loginPage.login(user.email, user.password);
    });
});

Given("user is on the home page", () => {
    loginPage.navigate(endPoints.home);
});

When("user searches for {string}", (searchTerm) => {
    homePage.enterSearchText(searchTerm);
    homePage.clickOnSearchButton();
});

When("user hovers and clicks on add to cart button", () => {
    searchPage.hoverAndClickOnAddToCartButton().then(product => {
        searchProduct = product;
    });
});

When("user clicks on cart icon", () => {
    homePage.clickOnCartIcon();
});

Then("product title and price in cart should match search result", () => {
    addToCartPage.getCartProductData().then(cartData => {
        expect(searchProduct.title).to.equal(cartData.title);
        expect(searchProduct.price).to.equal(cartData.price);
        expect(searchProduct.price).to.equal(cartData.total);
    });
});

When("user clicks on a product from search results", () => {
    searchPage.clickOnProduct().then(product => {
        searchProduct = product;
    });
});

Then("product details page should display correct title and price", () => {
    productDetailsPage.getProductTitle().then(detailsTitle => {
        productDetailsPage.getProductPrice().then(detailsPrice => {
            expect(searchProduct.title).to.equal(detailsTitle.trim());
            expect(searchProduct.price).to.equal(detailsPrice.trim());
        });
    });
});

When("user clicks on quick view", () => {
    searchPage.clickOnQuickView().then(product => {
        searchProduct = product;
    });
});

Then("quick view should display correct product title and price", () => {
    productDetailsPage.getViewProductTitle().then(viewTitle => {
        productDetailsPage.getViewProductPrice().then(viewPrice => {
            expect(searchProduct.title).to.equal(viewTitle.trim());
            expect(searchProduct.price).to.equal(viewPrice.trim());
        });
    });
});

Then("search results should contain relevant products", () => {
    cy.fixture("searchScenarios").then((scenarios) => {
        scenarios.forEach(({ searchTerm, expected }) => {
            homePage.enterSearchText(searchTerm);
            homePage.clickOnSearchButton();
            cy.contains(`Search - ${searchTerm}`).should("be.visible");

            homePage.getProductsTitles().each(($el) => {
                const text = $el.text().toLowerCase();
                expect(expected.some(keyword => text.includes(keyword))).to.be.true;
            });
        });
    });
});

When("user adds product to wishlist", () => {
    productDetailsPage.getProductDetails().then(details => {
        productDetails = details;
        expect(details.title).to.equal(searchProduct.title);
        expect(details.price).to.equal(searchProduct.price);
        productDetailsPage.addToWishList();
    });
});

When("user clicks on wishlist icon", () => {
    homePage.clickOnWishlistIcon();
});

Then("product should appear in wishlist with correct details", () => {
    wishlistPage.getWishlistItems().then(items => {
        const matchedItem = items.find(item =>
            item.productName.includes(productDetails.title) &&
            item.unitPrice.includes(productDetails.price) &&
            item.model.includes(productDetails.model) &&
            item.stock.includes(productDetails.stock)
        );

        expect(matchedItem, "wishlist entry for selected product with all details").to.not.be.undefined;
        expect(matchedItem.productName).to.include(productDetails.title);
        expect(matchedItem.unitPrice).to.include(productDetails.price);
        expect(matchedItem.model).to.include(productDetails.model);
        expect(matchedItem.stock).to.include(productDetails.stock);
    });
});

When("user removes product from wishlist", () => {
    wishlistPage.removeItemByProductName(productDetails.title, { unitPrice: productDetails.price });
});

Then("product should be removed from wishlist", () => {
    wishlistPage.getWishlistItems().then(updatedItems => {
        const stillPresent = updatedItems.some(item =>
            item.productName.includes(productDetails.title)
        );
        expect(stillPresent, "product should be removed from wishlist").to.be.false;
        if (!updatedItems.length) {
            cy.get(wishlistPage.wishlistTable).should("not.exist");
        }
    });
});

When("user filters by in stock products", () => {
    cy.wait(1000);
    searchPage.clickOnInStockLabel();
    cy.wait(3000);
});

When("user adds product to cart", () => {
    productDetailsPage.getProductDetails().then(details => {
        productDetails = details;
        productDetailsPage.clickOnAddToCart();
    });
});

When("user clicks on checkout button", () => {
    cy.wait(1000);
    addToCartPage.clickOnCheckoutButton();
    cy.wait(1000);
});

Then("product details should match on checkout page", () => {
    const normalizedTitle = productDetails.title.replace(/\s+/g, " ").trim().toLowerCase();

    checkoutPage.getCheckoutProducts().then(items => {
        const checkoutProduct = items.find(item => {
            if (!item.productName) {
                return false;
            }
            const itemTitle = item.productName.replace(/\s+/g, " ").trim().toLowerCase();
            return itemTitle.includes(normalizedTitle);
        });

        expect(checkoutProduct, "Product should exist in checkout").to.not.be.undefined;
        expect(checkoutProduct.productName).to.include(productDetails.title);
        expect(checkoutProduct.unitPrice).to.include(productDetails.price);
    });
});

When("user removes product from checkout", () => {
    checkoutPage.getCheckoutProducts().then(items => {
        const productToRemove = items.find(item => item.productName.includes(productDetails.title));
        expect(productToRemove, "Product to remove should exist in checkout").to.not.be.undefined;
        checkoutPage.removeItem(productToRemove.productName);
    });
});

Then("cart should be empty or product should be removed", () => {
    checkoutPage.getCheckoutProducts().then(updatedItems => {
        if (!updatedItems.length) {
            cy.get(checkoutPage.checkoutCartRows).should("not.exist");
            cy.contains(testText.cart.emptyCartMessage).should("exist");
        } else {
            const stillPresent = updatedItems.some(item =>
                item.productName.includes(productDetails.title)
            );
            expect(stillPresent, "Removed product should not be listed").to.be.false;
        }
    });
});

When("user clicks on compare product link", () => {
    productDetailsPage.clickOnCompareProductLink();
});

When("user clicks on compare icon", () => {
    homePage.clickOnCompareIcon();
});

Then("product name and price should match in compare table", () => {
    productComparePage.getProductTitle().then(compareProductName => {
        productComparePage.getProductPrice().then(compareProductPrice => {
            expect(compareProductName.trim()).to.eq(searchProduct.title.trim());
            expect(compareProductPrice.trim()).to.eq(searchProduct.price.trim());
        });
    });
});

When("user clicks on remove icon in compare page", () => {
    productComparePage.clickOnRemoveIcon();
});

Then("compared item should not be visible", () => {
    productComparePage.isComparedItemVisible().should("be.false");
});

Then("success alert should be displayed", () => {
    productComparePage.getSuccessAlertText().should("contain", testText.compare.successMessage);
});

When("user clicks on add to cart from compare page", () => {
    productComparePage.clickOnAddToCartButton();
});
