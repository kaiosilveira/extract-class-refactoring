import { Person } from './index';

describe('Person', () => {
  it('should correctly store a telephone number', () => {
    const person = new Person();

    person.officeAreaCode = '123';
    person.officeNumber = '4567890';

    expect(person.telephoneNumber).toEqual('(123) 4567890');
  });
});
