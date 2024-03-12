import RestClient from "../client/RestClient";

/**
 * BaseApi that can be extended from to provide an API interface for setting up calls to an external API
 * @example
 * class SomeApi extends BaseApi {
 *  
 * }
 */
export default abstract class BaseApi {
    public constructor(restClient?: RestClient) {
        if (restClient) {
          this.restClient = restClient;
        }
        this.restClient = new RestClient();
    
        this.initializeResponseInterceptor();
        this.initializeRequestInterceptor();
      }
}
