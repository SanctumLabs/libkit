import {amountToAmountInCents, readablePercentage} from '../number';

describe('amountToAmountInCents', () => {
  it('should correctly convert a floating point number into cents', () => {
    expect(amountToAmountInCents(523.67)).toBe(52367);
    expect(amountToAmountInCents(2.22)).toBe(222);
    expect(amountToAmountInCents(0)).toBe(0);
    expect(amountToAmountInCents(0.01)).toBe(1);
    expect(amountToAmountInCents(0.001)).toBe(0);
  });
});

describe('readablePercentage', () => {
  test.each([
    [10, 0, undefined, undefined],
    [0, 1, undefined, '0%'],
    [4, 10, undefined, '40%'],
    [0.4, undefined, undefined, '40%'],
    [1, undefined, undefined, '100%'],
    [1.1, 10, undefined, '11%'],
    [0.5575, undefined, 2, '55.75%'],
    [1.3456, undefined, 1, '134.6%'],
  ])(
    'readablePercentage(%p, %p, %p) => %p',
    (numeratorOrFraction, denominator, precision, expected) => {
      expect(readablePercentage(numeratorOrFraction, denominator, precision)).toEqual(expected);
    },
  );
});
