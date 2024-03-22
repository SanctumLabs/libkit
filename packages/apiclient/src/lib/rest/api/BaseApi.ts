import RestClient from '../client/RestClient';

/**
 * BaseApi that can be extended from to provide an API interface for setting up calls to an external API
 * @example
 * class SomeApi extends BaseApi {
 *
 * }
 */
export default abstract class BaseApi {
  get: any;
  post: any;
  put: any;
  patch: any;
  delete: any;

  public constructor(restClient: RestClient) {
    this.get = restClient.get;
    this.post = restClient.post;
    this.put = restClient.put;
    this.patch = restClient.patch;
    this.delete = restClient.delete;
  }
}
