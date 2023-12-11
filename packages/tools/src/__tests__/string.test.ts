import {maskEmailAddress, maskMobileNumber, initials, truncate} from '../string';

describe('maskEmailAddress', () => {
  test.each([[''], ['not an email'], ['notanemail@'], ['@notanemail'], ['@notanemail.com']])(
    `invalid email: %p`,
    (email) => {
      expect(maskEmailAddress(email)).toEqual(email);
    },
  );

  test.each([
    ['a@b.c', 'a**@b**.c'],
    ['a@b.c.d', 'a**@b**.c.d'],
    ['test@example.com', 'te**@ex**.com'],
  ])('valid email: %p => %p', (email, expected) => {
    expect(maskEmailAddress(email)).toEqual(expected);
  });
});

describe('maskMobileNumber', () => {
  test.each([[''], ['fdsafrag'], ['vfds15vfds12'], ['@#$%^&*()-=±§>.,']])(
    `invalid mobile number: %p`,
    (mobileNumber) => {
      expect(maskMobileNumber(mobileNumber)).toEqual(mobileNumber);
    },
  );

  test.each([
    ['0714582216', '071****216'],
    ['+27714582216', '+277****2216'],
  ])('valid mobile number: %p => %p', (mobileNumber, expected) => {
    expect(maskMobileNumber(mobileNumber)).toEqual(expected);
  });
});

describe('initials', () => {
  test.each([
    ['', ''],
    ['Bob', 'B'],
    ['Bob Jones', 'BJ'],
    ['Bob Earl Jones', 'BEJ'],
    ['Billy-Bob Jones', 'BJ'],
  ])('%p -> %p', (input, expected) => {
    expect(initials(input)).toEqual(expected);
  });
});

describe('truncate', () => {
  test.each([
    ['', 0, ''],
    ['H', 1, 'H'],
    ['Hello', 5, 'Hello'],
    ['Hello', 4, 'Hel…'],
    ['Hello', 10, 'Hello'],
  ])('%p -> %p', (input, len, expected) => {
    expect(truncate(input, len)).toEqual(expected);
  });
});
