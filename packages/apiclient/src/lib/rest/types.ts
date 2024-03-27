import {AxiosInstance} from 'axios';
import {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';

export type BaseClientConfigure = (
  instance: AxiosInstance,
  originalConfigure?: BaseClientConfigure,
) => void;

export type BaseClientOptions = {
  baseURL: string;
  configure?: BaseClientConfigure;
};

export type ApiRequestConfig = AxiosRequestConfig;
export type ApiResponse<T = unknown> = AxiosResponse<T>;
export type ApiError<T = unknown> = AxiosError<T>;

export type APIResult<T> = {
  data: T;
  error?: string;
  message?: string;
  status: number;
};

export type APIRequest = <T, TResult = APIResult<T>>(
  url: string,
  config?: ApiRequestConfig,
) => Promise<AxiosResponse<TResult>>;

export type APIRequestWithBody = <T>(
  url: string,
  data?: any,
  config?: ApiRequestConfig,
) => Promise<AxiosResponse<APIResult<T>>>;

export interface Interceptor {
  (instance: AxiosInstance, ...args: any[]): void;
}
