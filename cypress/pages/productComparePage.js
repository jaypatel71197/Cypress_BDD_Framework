export default class ProductComparePage {
    productTitle = "a > strong";
    productPrice = '//tr/td[text()="Price"]//following-sibling::td';
    productTable = "table.table.table-responsive.table-bordered";
    removeButton = '//a[contains(@href,"remove")]';
    successAlert = ".alert.alert-success.alert-dismissible";
    addToCartButton = 'input[value="Add to Cart"]';

    getProductTitle() {
        return cy.get(this.productTitle).invoke("text");
    }

    getProductPrice() {
        return cy.xpath(this.productPrice).invoke("text");
    }

    isComparedItemVisible() {
        return cy.get("body").then($body => {
            const $table = $body.find(this.productTable);
            if (!$table.length) {
                return false;
            }
            const $rows = $table.find("tbody tr");
            let hasItem = false;
            $rows.each((_, row) => {
                const $cells = Cypress.$(row).find("td");
                if ($cells.length > 1 && $cells.eq(1).text().trim().length > 0) {
                    hasItem = true;
                }
            });
            return hasItem;
        });
    }

    clickOnRemoveIcon() {
        cy.xpath(this.removeButton).click();
    }

    getSuccessAlertText() {
        return cy.get(this.successAlert).invoke("text");
    }

    clickOnAddToCartButton() {
        cy.get(this.addToCartButton).click();
    }
}
