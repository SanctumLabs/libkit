import {AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import {fullURL} from '../utils';
import {acceptLanguageHeaderValues} from '@sanctumlabs/toolkit';

export type LanguageHeaderInterceptorOptions = {
  currentLanguages: () => ReadonlyArray<string>;
  urlPredicate: (url: string) => boolean;
};

/**
 * Axios interceptor to log API requests, responses, and errors.
 *
 * @param options
 * @param [options.currentLanguages] - Function that returns language codes for
 *   the current language(s).
 * @param [options.urlPredicate] - Predicate function to decide whether a URL
 *   should receive the header(s).
 * @param instance - Axios instance.
 */
export function languageHeaderInterceptor(
  options: LanguageHeaderInterceptorOptions,
  instance: AxiosInstance,
) {
  const {currentLanguages, urlPredicate} = options;

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (urlPredicate(fullURL(instance, config))) {
        const weightedLangs = acceptLanguageHeaderValues(currentLanguages());
        if (weightedLangs.length > 0) {
          if (!config.headers) {
            // @ts-ignore
            config.headers = {};
          }
          config.headers['Accept-Language'] = weightedLangs.join(', ');
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
}
