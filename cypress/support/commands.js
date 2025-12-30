// Custom commands inspired by Cypress docs

// Login via UI and cache session (optional helper)
Cypress.Commands.add("login", (email, password) => {
	cy.session([email, password], () => {
		cy.visit("/index.php?route=account/login");
		cy.get("#input-email").clear().type(email);
		cy.get("#input-password").clear().type(password);
		cy.get("input[type='submit']").click();
		cy.url().should("include", "account/account");
	});
});

// data-cy selector helper
Cypress.Commands.add("dataCy", (value) => cy.get(`[data-cy="${value}"]`));

// Generic network wait helper
Cypress.Commands.add("waitForApi", (method, urlPattern, alias = "api") => {
	cy.intercept(method, urlPattern).as(alias);
	cy.wait(`@${alias}`);
});
