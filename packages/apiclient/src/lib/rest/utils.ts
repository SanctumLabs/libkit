import {AxiosError, AxiosInstance, AxiosResponse, AxiosRequestConfig} from 'axios';
import { resolveURL } from '@sanctumlabs/toolkit';

/**
 * Is an error instance actually an `AxiosError`?
 *
 * This will allow narrowing the type to `AxiosError` if the function returns
 * `true`.
 */
export function isAxiosError(error?: unknown): error is AxiosError {
  return typeof (error as any)?.response?.status === 'number';
}

/**
 * Displays axios config
 * @param instance Axios Instance
 * @param responseOrConfig Axios response or request config
 * @returns axios config as a string
 */
export function displayAxiosConfig(
  instance: AxiosInstance,
  responseOrConfig: AxiosResponse | AxiosRequestConfig,
) : string {
  const config =
    'config' in responseOrConfig ? (responseOrConfig.config as AxiosRequestConfig) : responseOrConfig;
  const response = 'config' in responseOrConfig ? responseOrConfig : undefined;
  const requestID = (config as any)._requestID;
  const humanRequestID = requestID !== undefined ? `(${requestID}) ` : '';
  const status = response?.status ?? ' - ';
  const method = config.method?.toUpperCase() ?? '-';
  return `${humanRequestID}${method} ${status} ${fullURL(instance, config)}`;
}

/**
 * Create a full URL from an Axios instance and request config.
 */
export function fullURL(instance: AxiosInstance, config: AxiosRequestConfig) {
  const uri = instance.getUri(config);
  return resolveURL(config.baseURL ?? '', uri);
}
