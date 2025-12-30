import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import UserLoginPage from "../../../pages/auth/userLoginPage";
import { endPoints } from "../../../constant/urlEndPoints";
import { testText } from "../../../constant/testText";

const loginPage = new UserLoginPage();

Given("user is on the login page", () => {
  loginPage.navigate(endPoints.login);
});

When("user enters valid email and password", () => {
  cy.fixture("loginUser").then((user) => {
    loginPage.enterEmail(user.email);
    loginPage.enterPassword(user.password);
  });
});

When("user enters invalid email and valid password", () => {
  cy.fixture("loginUser").then((user) => {
    loginPage.enterEmail(user.invalidEmail);
    loginPage.enterPassword(user.password);
  });
});

When("user enters valid email and invalid password", () => {
  cy.fixture("loginUser").then((user) => {
    loginPage.enterEmail(user.email);
    loginPage.enterPassword(user.invalidPassword);
  });
});

When("user clicks on login button", () => {
  loginPage.submitForm();
});

Then("user should be redirected to account dashboard", () => {
  cy.url().should("include", testText.urls.accountDashboard);
});

Then("user should see dashboard sections", () => {
  cy.contains(testText.dashboard.myAccount).should("be.visible");
  cy.contains(testText.dashboard.myOrders).should("be.visible");
  cy.contains(testText.dashboard.myAffiliateAccount).should("be.visible");
});

Then("user should see warning alert message", () => {
  loginPage.getAlertMessage().should("be.visible").and("contain", testText.alerts.warning);
});

Then("user should remain on login page", () => {
  cy.url().should("include", "login");
});
