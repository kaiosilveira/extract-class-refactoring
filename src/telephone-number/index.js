export class TelephoneNumber {
  get telephoneNumber() {
    return `(${this.areaCode}) ${this.officeNumber}`;
  }

  get areaCode() {
    return this._areaCode;
  }

  set areaCode(arg) {
    this._areaCode = arg;
  }

  get officeNumber() {
    return this._officeNumber;
  }

  set officeNumber(arg) {
    this._officeNumber = arg;
  }
}
