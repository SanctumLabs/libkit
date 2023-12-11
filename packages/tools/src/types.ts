export type PromiseResolve<TResult> = (result: TResult) => void;
export type PromiseReject<TError = Error> = (error: TError) => void;
export type PromiseFunction<R> = (...args: any[]) => Promise<R>;

/**
 * A base type for representing asynchronous data.
 *
 * Prefer to extend the type to include additional information, instead of
 * cramming non-data into `data`.
 *
 * @example
 * ```tsx
 * type HookData = {
 *   something: string;
 * };
 * type SomeHookResult = StatefulResultObject<HookData> & {
 *   setSomething: (something: string) => void;
 *   reload: () => void;
 *   …,
 * }
 * ```
 */
export type StatefulResultObject<T, E = Error> =
  | {status: 'idle'; data?: T; error?: E}
  | {status: 'loading'; data?: T; error?: E}
  | {status: 'error'; data?: T; error: E}
  | {status: 'success'; data: T; error?: undefined};

export type AnyFunction = (...args: any) => any;
