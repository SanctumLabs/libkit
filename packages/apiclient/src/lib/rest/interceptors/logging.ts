import {AxiosInstance} from 'axios';
import {displayAxiosConfig} from '../utils';

/**
 * Axios interceptor to log API requests, responses, and errors.
 *
 * @param instance - Axios instance.
 */
export function loggingInterceptor(instance: AxiosInstance) {
  let counter = 0;

  instance.interceptors.request.use(
    (config) => {
      (config as any)._requestID = counter++;
      console.debug(`[API request  →] ${displayAxiosConfig(instance, config)}`);
      return config;
    },
    (error) => {
      console.debug('[API request error]', error);
      return Promise.reject(error);
    },
  );
}
