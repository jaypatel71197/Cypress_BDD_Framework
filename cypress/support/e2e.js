import "./commands";
import "cypress-real-events";
import "cypress-xpath";

Cypress.on("uncaught:exception", () => {
  return false;
});