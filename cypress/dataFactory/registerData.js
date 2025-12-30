import { faker } from "@faker-js/faker";
import Register from "../dataObject/register.js";

export default class RegisterData {
  static getData() {
    const registerData = new Register();
    registerData.firstName = faker.person.firstName();
    registerData.lastName = faker.person.lastName();
    registerData.email = faker.internet.email().toLowerCase();
    const password = faker.internet.password();
    registerData.password = password;
    registerData.confirmPassword = password;
    registerData.phone = faker.string.numeric(10);
    return registerData;
  }
}
