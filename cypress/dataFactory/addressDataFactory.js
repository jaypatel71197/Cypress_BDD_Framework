import { faker } from "@faker-js/faker";
import Address from "../dataObject/address.js";

export default class AddressDataFactory {
    static getData(country = "India", state = "Haryana") {
        const address = new Address();
        address.firstName = faker.person.firstName();
        address.lastName = faker.person.lastName();
        address.company = faker.company.name();
        address.address1 = faker.location.streetAddress();
        address.address2 = faker.location.secondaryAddress();
        address.city = faker.location.city();
        address.postCode = faker.string.numeric(6);
        address.country = country;
        address.state = state;
        return address;
    }
}
