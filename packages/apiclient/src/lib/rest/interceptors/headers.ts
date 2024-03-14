import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { fullURL } from '../utils';

export type AdditionalHeadersInterceptorOptions = {
  headers: () => Record<string, string> | Promise<Record<string, string>>;
  urlPredicate: (url: string) => boolean;
};

/**
 * Axios interceptor to insert arbitrary additional headers.
 *
 * Use this when configuring the client to add additional headers to requests.
 *
 * @param options
 * @param [options.headers] - Function that returns the additional headers to
 *   include in a request.
 * @param [options.urlPredicate] - Predicate function to decide whether a URL
 *   should receive the header(s).
 * @param instance - Axios instance.
 */
export function additionalHeadersInterceptor(
  options: AdditionalHeadersInterceptorOptions,
  instance: AxiosInstance,
) {
  const {headers, urlPredicate} = options;
  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    if (urlPredicate(fullURL(instance, config))) {
      if (!config.headers) {
        // @ts-ignore
        config.headers = {};
      }
      Object.assign(config.headers, await headers());
    }
    return config;
  });
}
