import {AxiosError, AxiosRequestConfig, AxiosResponse, AxiosInstance} from 'axios';

export type ApiRequestConfig = AxiosRequestConfig;
export type ApiResponse<T = unknown> = AxiosResponse<T>;
export type ApiError<T = unknown> = AxiosError<T>;

export interface Interceptor {
  (instance: AxiosInstance, ...args: any[]): void;
}
