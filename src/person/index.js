import { TelephoneNumber } from '../telephone-number';

export class Person {
  constructor() {
    this._telephoneNumber = new TelephoneNumber();
  }

  get name() {
    return this._name;
  }

  set name(arg) {
    this._name = arg;
  }

  get telephoneNumber() {
    return `(${this.officeAreaCode}) ${this.officeNumber}`;
  }

  get officeAreaCode() {
    return this._telephoneNumber.officeAreaCode;
  }

  set officeAreaCode(arg) {
    this._telephoneNumber.officeAreaCode = arg;
  }

  get officeNumber() {
    return this._telephoneNumber._officeNumber;
  }

  set officeNumber(arg) {
    this._telephoneNumber._officeNumber = arg;
  }
}
