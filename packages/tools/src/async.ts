import type {PromiseResolve, StatefulResultObject} from './types';

/**
 * Promise that waits for `timeout` milliseconds before resolving.
 *
 * @category Async
 */
export async function delay(timeout: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

/**
 * Promise that waits `timeout` milliseconds for `promise` to resolve, before
 * rejecting.
 *
 * @category Async
 */
export function timeout<T>(timeout: number, promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    delay(timeout).then(() => {
      throw new Error('Timed out waiting for result');
    }),
  ]);
}

export type WaitForResult<T> = () => Promise<T>;
export type DeliverResult<T> = (value: T | undefined) => void;
export type AsyncResult<T> = [WaitForResult<T>, DeliverResult<T>];

/**
 * Deliver results from one place, while waiting on them in another place.
 *
 * The primary purpose of this function is to allow waiting on a result that
 * may not be available immediately, in a way that doesn't require calling the
 * producing function, such as waiting on a token being fetched from
 * `AsyncStorage`.
 *
 * This is just an inside-out promise, where the resolver is external from the
 * promise itself.
 *
 * Combine with the `timeout` function to limit how long to wait for a result.
 *
 * @category Async
 */
export function asyncResult<T>(): [WaitForResult<T>, DeliverResult<T>] {
  let result: T | undefined;
  const queue: Array<PromiseResolve<T | undefined>> = [];

  function waitForResult() {
    if (result !== undefined) {
      return Promise.resolve(result);
    }
    return new Promise<T>((resolve) => {
      queue.push(resolve as PromiseResolve<T | undefined>);
    });
  }

  function deliverResult(value: T | undefined) {
    result = value;
    while (queue.length) {
      const resolve = queue.shift();
      resolve?.(result);
    }
  }

  return [waitForResult, deliverResult];
}

/**
 * Apply a transform to a stateful result's value, only if the stateful result
 * is not in an error state.
 *
 * If the result has an error then the whole result is returned unchanged.
 *
 * The idea is to use this instead of unpacking a stateful result, checking for
 * an error, then maybe transforming the result, and finally repacking the
 * stateful result. The reason for wanting to do this is to preserve important
 * information about the transient result such as whether it is loading or
 * whether there is an error, so that downstream code can show appropriate UI.
 *
 * @category Async
 *
 * @example
 * ```tsx
 * // It is necessary to unpack and use the unpacked result, so that the hook
 * // dependencies can be checked, and the array container doesn't break
 * // memoization.
 * const [data, isLoading, error] = useSomethingWithStatefulResult();
 * return React.useMemo(() => transformStatefulResult(
 *   [data, isLoading, error],
 *   (result) => {
 *     return doTransformOfSomething(result, some, other, things);
 *   }), [data, isLoading, error, some, other, things]);
 * ```
 */
export function transformStatefulResult<TFrom, TTo, TError>(
  result: StatefulResultObject<TFrom, TError>,
  transform: (value?: TFrom) => TTo,
): StatefulResultObject<TTo, TError> {
  const {status, data, error} = result;
  if (status !== 'success') {
    return result as StatefulResultObject<TTo, TError>;
  } else {
    return {
      status,
      data: transform(data),
      error,
    } as StatefulResultObject<TTo, TError>;
  }
}

export interface Deferred<T, E = unknown> {
  promise: Promise<T>;
  resolve(value: T): void;
  reject(error: E): void;
}

/**
 * Create a "deferred", that is a `Promise` that can be resolved/rejected by
 * the caller.
 */
export function deferred<T, E = unknown>(): Deferred<T, E> {
  let resolve: (value: T) => void = () => undefined;
  let reject: (error: E) => void = () => undefined;
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {promise, resolve, reject};
}
