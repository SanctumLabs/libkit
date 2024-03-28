import type {AsyncResult, PromiseFunction} from '@sanctumlabs/toolkit';
import {asyncResult} from '@sanctumlabs/toolkit';

import type {AuthType, AuthFunction} from '../types';
import BaseApi from '../api';

const typesOfAuth: Record<AuthType, AsyncResult<string>> = {
  // This should probably never be used.
  none: asyncResult<string>(),
  user: asyncResult<string>(),
  owner: asyncResult<string>(),
};

/**
 * Wait for an auth token for an auth type.
 */
export function waitForAuthToken(authType: AuthType) {
  return typesOfAuth[authType][0]();
}

/**
 * Deliver an auth token for an auth type.
 */
export function deliverAuthToken(authType: AuthType, token: string | undefined) {
  return typesOfAuth[authType][1](token);
}

/**
 * Wait for a specific auth token, via `waitForAuthToken`.
 */
export const defaultAuthFunction: AuthFunction = async (authType) => {
  if (authType !== 'none') {
    await waitForAuthToken(authType);
  }
};

/**
 * Decorator that waits for an auth function before calling the wrapped method.
 *
 * @example
 * class Something {
 *   @auth()
 *   async getItems(…) {
 *     // Make an API call that expects the auth token to exist.
 *   }
 * }
 */
function auth(authType: AuthType = 'user') {
  return function authDecorator(
    _target: any,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<PromiseFunction<any>>,
  ) {
    const method = descriptor.value;
    if (method !== undefined) {
      descriptor.value = async function (this: BaseApi, ...args: Parameters<typeof method>) {
        await this.__authFunction?.(authType);
        return method?.apply(this, args);
      };
    }
  };
}

export default auth;
