/**
 * Convert an amount into cents rounded to the nearest integer.
 *
 * @example
 * ```typescript
 * const amount = '523.67';
 * const amountInCents = amountToAmountInCents(amount);
 * console.log(amountInCents);
 * // returns '52367'
 * ```
 */
export function amountToAmountInCents(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Given a price and a discount (in absolute value),
 * returns the percentage of the discount rounded to two decimal places.
 *
 * @example
 * ```typescript
 * const price = '200';
 * const discount = '66.66';
 * console.log(roundedDiscountPercentage(price, discount));
 * // returns '33.33'
 * ```
 */
export function roundedDiscountPercentage(price: number, discount: number): number {
  if (price === 0) {
    return 0;
  }
  return Math.round((discount / price) * 10000) / 100;
}

/**
 * Display a value as a human-readable percentage.
 *
 * @param numeratorOrFraction - Either the numerator to divide by `denominator`,
 *   or a fraction to scale up to a percentage
 * @param [denominator] - Denominator to divide `numeratorOrFraction` by
 * @param [precision] - Number of decimal places to include
 * @return A human-readable percentage or `undefined` if formatting was not
 *   possible.
 */
export function readablePercentage(
  numeratorOrFraction: number,
  denominator?: number,
  precision = 0,
): string | undefined {
  const fraction =
    denominator === undefined
      ? numeratorOrFraction
      : denominator
      ? numeratorOrFraction / denominator
      : undefined;
  if (fraction === undefined) {
    return undefined;
  } else {
    return `${(fraction * 100).toFixed(precision)}%`;
  }
}
