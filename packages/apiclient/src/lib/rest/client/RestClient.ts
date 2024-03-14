import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { defaultClientConfigurer } from './configurer';
import { BaseClientOptions } from './types';

const axiosInstance = (baseUrl: string) => axios.create({
  baseURL: baseUrl,
  responseType: 'json',
});

/**
 * RestClient that provides HTTP functionality to interact with REST protocol services.
 * Usage:
 * @example
 * const restClient = new RestClient({baseURL: "http://api.example.com"})
 * await const data = restClient.get("/some-path")
 * // do something with data
 */
export default class RestClient {
  readonly axiosInstance: AxiosInstance;

  /**
   * Creates an instance of RestClient with the underlying 3rd party Rest client.
   * a base url is required for instantiation.
   * @param baseURL BaseURL that will be used when performing requests to a service/server
   * @param configurer configures the Rest client
   */
  public constructor({ baseURL, configure = defaultClientConfigurer }: BaseClientOptions) {
    const instance = axiosInstance(baseURL);
    configure?.(instance, defaultClientConfigurer);
    this.axiosInstance = instance;
  }

  /**
   * Performs a GET request on the provided path
   * @param path Path of request
   * @param config Optional configuration for request
   * @returns Response for get request
   */
  async get<T>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await this.axiosInstance.get<T>(path, config);
    return response;
  }

  /**
   * Performs a POST request on the provided path
   * @param path path of the request
   * @param data optional data to send out with request
   * @param config optional configuration
   * @returns Response of request
   */
  async post<T>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const response = await this.axiosInstance.post<T>(path, data, config);
    return response;
  }

  /**
   * performs a PUT operation.
   * @param path path of request
   * @param data optional data to send out with data
   * @param config optional configuration for request
   * @returns response from server/service
   */
  async put<T>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const response = await this.axiosInstance.put<T>(path, data, config);
    return response;
  }

  /**
   * Performs a PATCH operation on request
   * @param {string} path path of request
   * @param {unknown} data optional data to send out with request
   * @param {AxiosRequestConfig} config optional configuration to send out with request
   * @returns Response returned with request
   */
  async patch<T>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const response = await this.axiosInstance.patch<T>(path, data, config);
    return response;
  }

  /**
   * Performs a DELETE operation on a resource on the API
   * @param path Path of request
   * @param config optional configuration to send with request
   * @returns Response type returned from request
   */
  async delete<T>(
    path: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const response = await this.axiosInstance.delete<T>(path, config);
    return response
  }

  /**
   * Performs multiple async requests at once
   * @param requests Number of requests to perform requests async
   * @returns list of responses from all requests
   */
  async all<T>(requests: (T | Promise<T>)[]): Promise<T[]> {
    const responses = Promise.all(requests);
    return responses;
  }

  /**
   * resolves all the requests
   * @param requests Performs all requests async
   * @returns list of responses
   */
  async allSettled<T>(requests: (T | Promise<T>)[]) {
    const responses = Promise.allSettled(requests);
    return responses;
  }
}