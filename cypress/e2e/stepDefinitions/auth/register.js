import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import UserRegisterPage from "../../../pages/auth/userRegisterPage";
import UserLoginPage from "../../../pages/auth/userLoginPage";
import RegisterData from "../../../dataFactory/registerData";
import { endPoints } from "../../../constant/urlEndPoints";
import { testText } from "../../../constant/testText";

const registerPage = new UserRegisterPage();
const loginPage = new UserLoginPage();
let userData;

Given("user is on the registration page", () => {
  userData = RegisterData.getData();
  loginPage.navigate(endPoints.register);
});

When("user fills registration form with valid data", () => {
  registerPage.addRegisterData(userData);
});

When("user fills registration form with existing email", () => {
  cy.fixture("loginUser").then((user) => {
    userData.email = user.email;
    registerPage.addRegisterData(userData);
  });
});

When("user fills registration form without email", () => {
  registerPage.enterFirstName(userData.firstName);
  registerPage.enterLastName(userData.lastName);
  registerPage.enterPhone(userData.phone);
  registerPage.enterPassword(userData.password);
  registerPage.enterConfirmPassword(userData.confirmPassword);
});

When("user agrees to terms and conditions", () => {
  registerPage.clickOnAgreeCheckbox();
});

When("user submits registration form", () => {
  registerPage.submitForm();
});

When("user clicks on continue button", () => {
  registerPage.clickOnContinueButton();
});

Then("user should see registration success message", () => {
  cy.contains(testText.registration.successHeading).should("be.visible");
});

Then("user should see invalid email alert", () => {
  registerPage.getInvalidEmailAlert().should("be.visible").and("contain", "E-Mail Address does not appear to be valid!");
});

Then("user should remain on registration page", () => {
  cy.url().should("include", "register");
});
