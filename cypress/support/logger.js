export const log = {
  info(message) {
    cy.log(`[INFO] ${message}`);
  },
  error(message) {
    cy.log(`[ERROR] ${message}`);
  },
  warn(message) {
    cy.log(`[WARN] ${message}`);
  }
};
