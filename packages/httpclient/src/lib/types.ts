import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export type ApiRequestConfig = AxiosRequestConfig;
export type ApiResponse<T = unknown> = AxiosResponse<T>;
export type ApiError<T = unknown> = AxiosError<T>;