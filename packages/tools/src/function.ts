import {throttle} from 'lodash';

import type {AnyFunction} from './types';

/**
 * A function that returns its only argument.
 *
 * This can be useful as a no-operation default value in cases, to simplify
 * code that would otherwise have a series of checks.
 *
 * @example
 * ```typescript
 * import {identity} from '@sanctumlabs/toolkit';
 *
 * function readSomeThing(container, key, transform = identity) {
 *   // The alternative using `undefined` instead of a default would be:
 *   // const value = container.get(key);
 *   // return transform !== undefined ? transform(value) : value;
 *   return transform(container.get(key));
 * }
 * ```
 */
export function identity<T>(value: T): T {
  return value;
}

/**
 * Convenience function to wrap another function that despams user input that
 * needs to happen upfront, such as clicking a button.
 *
 * This is achieved by only calling a function once every `period`
 * milliseconds, any other attempts to call this function are discarded.
 *
 * **NOTE:** The result of this function should be saved, since repeated calls
 * will create new versions of the despammed function.
 *
 * @example
 * const onSubmitToServer = React.useMemo(() => {
 *   return despam(async (data) => {
 *     await apiCalL(…);
 *   });
 * }, […]);
 */
export function despam<T extends AnyFunction>(f: T, wait = 500): T {
  return throttle(f, wait, {leading: true, trailing: false}) as unknown as T;
}

/**
 * Convenience function to wrap another function that despams user input that
 * should only take effect once the user is done (or idle), such as typing into
 * a search filter.
 *
 * This is achieved by only calling a function once every `period`
 * milliseconds, any other attempts to call this function are discarded.
 *
 * **NOTE:** The result of this function should be saved, since repeated calls
 * will create new versions of the despammed function.
 *
 * @example
 * const onTextValueChanged = React.useMemo(() => {
 *   return despamTrailing((searchText) => {
 *     updateSearchFilter(searchText);
 *   });
 * }, […]);
 */
export function despamTrailing<T extends AnyFunction>(f: T, wait = 150): T {
  return throttle(f, wait, {leading: false, trailing: true}) as unknown as T;
}
