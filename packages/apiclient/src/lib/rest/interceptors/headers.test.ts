import {AxiosInstance, AxiosRequestConfig} from 'axios';
import {AdditionalHeadersInterceptorOptions, additionalHeadersInterceptor} from './headers';

type HeadersForTestRequestFactoryOptions<TOptions> = {
  installInterceptor: (options: TOptions, axios: AxiosInstance) => void;
  requestConfigFactory?: (options: TOptions) => AxiosRequestConfig;
};

const TEST_BASE_URL = 'https://example.com';

/**
 * Create a `headersForTest` function that will install an interceptor,
 * provide an optional request config, set up a mock Axios request, and make a
 * request to the endpoint.
 */
function headersForTestRequestFactory<TOptions>({
  installInterceptor,
  requestConfigFactory,
}: HeadersForTestRequestFactoryOptions<TOptions>) {
  return async function headersForTestRequestForInterceptor(options: TOptions) {
    const {axios, mock, endpointURL} = apiTestFixtures({baseURL: TEST_BASE_URL});
    installInterceptor(options, axios);

    mock.onGet(endpointURL('/foo')).replyOnce(200, {});
    await axios.get('/foo', requestConfigFactory?.(options));
    expect(mock.history.get).toHaveLength(1);
    return mock.history.get[0].headers;
  };
}

describe('additionalHeadersInterceptor', () => {
  const ADDITIONAL_HEADERS = {
    'YC-Data-Platform': 'jest',
    'X-Test-Marker': '42',
  };
  const additionalHeaders = () => ADDITIONAL_HEADERS;
  const asyncAdditionalHeaders = () => Promise.resolve(ADDITIONAL_HEADERS);

  type AdditionalHeadersTestOptions = {
    headers: AdditionalHeadersInterceptorOptions['headers'];
    urlPredicate?: AdditionalHeadersInterceptorOptions['urlPredicate'];
  };
  const headersForTestRequest = headersForTestRequestFactory<AdditionalHeadersTestOptions>({
    installInterceptor(options, axios) {
      additionalHeadersInterceptor(
        {
          headers: options.headers,
          urlPredicate: options.urlPredicate ?? always,
        },
        axios,
      );
    },
  });

  test('accepted URLs receive headers', async () => {
    const headers = await headersForTestRequest({
      urlPredicate: always,
      headers: additionalHeaders,
    });
    expect(headers).toHaveProperty('YC-Data-Platform', 'jest');
    expect(headers).toHaveProperty('X-Test-Marker', '42');
  });

  test('rejected URLs receive no headers', async () => {
    const headers = await headersForTestRequest({
      urlPredicate: never,
      headers: additionalHeaders,
    });
    expect(headers).not.toHaveProperty('YC-Data-Platform');
    expect(headers).not.toHaveProperty('X-Test-Marker');
  });

  test('async header function', async () => {
    const headers = await headersForTestRequest({
      headers: asyncAdditionalHeaders,
    });
    expect(headers).toHaveProperty('YC-Data-Platform', 'jest');
    expect(headers).toHaveProperty('X-Test-Marker', '42');
  });
});
