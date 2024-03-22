import {AxiosInstance} from 'axios';
import {loggingInterceptor} from '../interceptors';

export function defaultClientConfigurer(instance: AxiosInstance) {
  loggingInterceptor(instance);
}
