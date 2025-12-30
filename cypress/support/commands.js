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

// Skip tests gracefully when the demo environment is unavailable.
// NOTE: This uses the Mocha test context (function() {}) to call this.skip().
// Pass the Mocha context from a normal function() step: cy.skipIfEnvDown(this, url)
Cypress.Commands.add("skipIfEnvDown", (mochaCtx, url, options = {}) => {
	const {
		method = "GET",
		acceptableStatusCodes = [200],
		timeout = 15000,
		log = true,
	} = options;

	cy.request({
		method,
		url,
		failOnStatusCode: false,
		timeout,
	}).then((resp) => {
		const ok = acceptableStatusCodes.includes(resp.status);
		if (!ok) {
			if (log) {
				Cypress.log({
					name: "skipIfEnvDown",
					message: `Skipping - ${url} returned ${resp.status}`,
				});
			}
			if (mochaCtx && typeof mochaCtx.skip === "function") {
				mochaCtx.skip();
			}
		}
	});
});
