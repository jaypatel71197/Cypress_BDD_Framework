import CheckoutPage from "./checkoutPage";

export default class ConfirmOrderPage extends CheckoutPage {
    orderSummaryTable = "#content table.table-bordered.table-hover";
    orderSummaryCells = "td";
    paymentAddressHeadingText = "Payment Address";
    cardContainer = ".card.mb-4";
    cardBody = ".card-body";
    confirmOrderButton = "button#button-confirm";

    clickOnConfirmOrderButton() {
        cy.get(this.confirmOrderButton).click();
    }

    getConfirmOrderSummary() {
        return cy.get(this.orderSummaryTable, { timeout: 10000 }).then($table => {
            const $root = Cypress.$($table);
            const products = [];
            const summary = [];

            $root.find("tbody tr").each((_, row) => {
                const $row = Cypress.$(row);
                const $cells = $row.find(this.orderSummaryCells);
                if (!$cells.length) {
                    return;
                }

                const productName = this.normalizeText($cells.eq(0).text());
                const model = this.normalizeText($cells.eq(1).text());
                const quantityText = this.normalizeText($cells.eq(2).text());
                const unitPriceText = this.normalizeText($cells.eq(3).text());
                const totalPriceText = this.normalizeText($cells.eq(4).text());

                const quantity = Number(quantityText);
                const unitPriceValue = this.parseCurrency(unitPriceText);
                const totalPriceValue = this.parseCurrency(totalPriceText);
                const calculatedTotal = Number((quantity * unitPriceValue).toFixed(2));

                products.push({
                    productName,
                    model,
                    quantity,
                    unitPrice: unitPriceText,
                    unitPriceValue,
                    totalPrice: totalPriceText,
                    totalPriceValue,
                    calculatedTotal,
                    totalMatchesCalculation: totalPriceValue === calculatedTotal
                });
            });

            $root.find("tfoot tr").each((_, row) => {
                const $row = Cypress.$(row);
                const $cells = $row.find(this.orderSummaryCells);
                if ($cells.length < 2) {
                    return;
                }

                const label = this.normalizeText($cells.eq(0).text());
                const valueText = this.normalizeText($cells.eq(1).text());

                summary.push({
                    label,
                    value: valueText,
                    valueNumber: this.parseCurrency(valueText)
                });
            });

            return cy.wrap({ products, summary });
        });
    }

    getPaymentAddressDetails() {
        return cy.contains("#content h4", this.paymentAddressHeadingText, { timeout: 10000 })
            .next(this.cardContainer)
            .find(this.cardBody)
            .then($body => {
                const textSegments = $body
                    .text()
                    .split("\n");

                let lines = textSegments
                    .map(line => this.normalizeText(line))
                    .filter(Boolean);

                if (lines.length <= 1) {
                    const htmlContent = $body.html() || "";
                    lines = htmlContent
                        .split(/<br\s*\/?>(?![^<]*>)/gi)
                        .map(segment => this.normalizeText(segment.replace(/<[^>]+>/g, " ")))
                        .filter(Boolean);
                }

                if (!lines.length) {
                    throw new Error("Payment address details were not found on confirm order page");
                }

                return cy.wrap({
                    lines,
                    text: lines.join("\n")
                });
            });
    }
}
