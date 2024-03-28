import RestClient from '../client/RestClient';
import { defaultAuthFunction } from '../client/auth';
import {APIRequest, APIRequestWithBody, AuthFunction} from '../types';
import {ApiRequestConfig} from '../types';

export interface BaseApiOptions {
  authFunction?: AuthFunction;
}

/**
 * BaseApi that can be extended from to provide an API interface for setting up calls to an external API
 * conveniently. The client has been exposed to provide the underlying API further functionality to add
 * interceptors and configuration if need be. The HTTP verbs, GET, POST, DELETE, PUT, PATCH have been set to
 * `protected` to only allow the API class to access these verbs without it being exposed outside the API.
 *
 * @example
 * import RestClient from "../client";
 * import BaseApi from "./BaseApi";
 *
 * export class TransactionApi extends BaseApi {
 *     async transactions(): Promise<string[]> {
 *         const t = await this.get<string[]>("/transactions")
 *         return t.data.data
 *     }
 * }
 *
 * // somewhere in your setup, setup the client and the API
 * const restClient = new RestClient({ baseURL: 'http://api.example.com' })
 * const transactionsApi = new TransactionApi(restClient)
 *
 * const transactions = transactionsApi.transactions()
 *
 */
export default abstract class BaseApi {
  protected client: RestClient;
  protected get: APIRequest;
  protected post: APIRequestWithBody;
  protected put: APIRequestWithBody;
  protected patch: APIRequestWithBody;
  protected delete: APIRequest;
  protected options: APIRequest;

  __authFunction: AuthFunction;

  public constructor(restClient: RestClient, options?: BaseApiOptions) {
    const maybeCombineConfig = (config?: ApiRequestConfig) => {
      return typeof this.requestConfig === 'function'
        ? Object.assign({}, config, this.requestConfig(config))
        : config;
    };

    const wrapMethod = (method: APIRequest): APIRequest => {
      return (url: string, config?: ApiRequestConfig) => method(url, maybeCombineConfig(config));
    };

    const wrapBodyMethod = (method: APIRequestWithBody): APIRequestWithBody => {
      return (url: string, data?: any, config?: ApiRequestConfig) =>
        method(url, data, maybeCombineConfig(config));
    };

    this.client = restClient;
    this.__authFunction = options?.authFunction ?? defaultAuthFunction;

    this.get = wrapMethod(restClient.get);
    this.post = wrapBodyMethod(restClient.post);
    this.put = wrapBodyMethod(restClient.put);
    this.patch = wrapBodyMethod(restClient.patch);
    this.delete = wrapMethod(restClient.delete);
    this.options = wrapMethod(restClient.options)
  }

  /**
   * Provide a new Axios request config to merge with the default one.
   */
  protected requestConfig(_config?: ApiRequestConfig): ApiRequestConfig | undefined {
    return undefined;
  }
}
