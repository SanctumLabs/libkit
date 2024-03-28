# API Client

API Client library that provides a API clients to interface with APIs. Useful to use when an application needs
to setup an API client for interacting with a Backend APIs.

## Install

```sh
yarn add @sanctumlabs/apiclient
```

## Usage

Creating an API client is a two-step process:

1. Create a "base" client; providing low-level network functionality.
2. Create the client; providing high-level API functionality.

```tsx
// setup an API to interact with your Backend API 
import {BaseApi, auth} from '@sanctumlabs/apiclient';

export class SomeApi extends BaseApi {
    @auth()
    async someResource(): Promise<string[]> {
        const t = await this.get<string[]>("/resources")
        return t.data.data
    }
}

// somewhere else in your setup, setup the RestClient

import {RestClient, deliverAuthToken} from '@sanctumlabs/apiclient';

// Obtain the auth token somehow, and deliver it to the client.
getAuthTokenSomehow().then(deliverAuthToken);

const restClient = new RestClient({ baseURL: 'http://api.example.com' })
const someApi = new SomeApi(restClient)

// Use the API client in the application.
const resources = await someApi.someResource()
```

## Why use two steps?

A clear separation of concerns means easier maintenance, and improved ability to
test, without having to globally mock the fetch mechanism. There are also
exciting opportunities for interesting base client implementations, for example:

- Use canned responses, instead of making a network request. Useful for testing.
- Use canned responses, but only for certain endpoints. Useful for development,
  when certain endpoints are difficult, or risky to call during development.
- Offer offline capabilities, using cached responses. Useful for production.
- Use transports other than HTTP-REST. Useful for future enhancements.

These are all possible with global mocking, but require significantly more
effort.

## Making a request

classes can subclass `BaseApi`, which provides several methods to make
HTTP calls: `get`, `post`, `patch`, `put`, `delete`, `options`

`get`, `options` and `delete` take two parameters, the URL, and the (optional) request
configuration:

```typescript
const result = await this.get<MyResponseType>('api/path/here', {
  params: {query: 'params', go: 'here'},
});
```

For `post`, `patch`, and `put`, the second parameter is the **request body**,
and the third parameter is the (optional) request configuration:

```typescript
const result = await this.post<MyResponseType>('api/path/here', {data: 'values', go: 'here'});
```

The request data will be coerced to JSON, so there is no need to stringify it
manually, in most circumstances.

See the [Axios documentation](https://www.npmjs.com/package/axios#request-method-aliases)
for more information about the request configuration.

## Handling errors

HTTP codes that indicate an error (400 and above) will result in an exception
from the API client, each caller must handle errors individually. The response
data can be retrieved from the thrown error:

```typescript
try {
  const loginResult = await api.client.login(…);
  // Happy path…
} catch (err) {
  const {message} = err.response.data;
  // Unhappy path… set some state for the error.
}
```

## Requiring an authentication token

In most cases, REST API calls require an authentication token, but often this
token needs to be retrieved asynchronously, leading to a dilemma:

Either the API client can only exist once the authentication token exists,
forcing _all_ client code to check for the existence of the API client first.
Alternatively, create the API client as soon as possible, but deliver the
authentication token later.

This library chooses the latter solution, for the simplified developer
experience. To help with this there is an `auth` [decorator], which will wait
for the authentication token before executing the wrapped function, used as
follows:

[decorator]: https://www.typescriptlang.org/docs/handbook/decorators.html

```typescript
import {auth} from '@sanctumlabs/apiclient';

export class … {
  @auth()
  async someMethod(…) {
    // Unchanged implementation, which will only be called once the
    // authentication token is available.
  }
}
```

> **NOTE:** `@auth` will force the wrapped function to be asynchronous.

In practice, most consumers of the API client can assume that it is always ready
to be used, and the decorator will automatically take care of the edge cases.

Additionally, the `authType` configuration parameter can be provided to instruct
the API client to wait for a token other than the `user` token, such as `none`
(unauthenticated) or `owner` (elevated permissions):

```typescript
import auth from '../auth';

export class … {
@auth('none')
  async someMethod(…) {
    const result = await this.THE_METHOD<…>(
      …,
      …,  // This parameter is the data when using POST, PATCH, or PUT.
      {authType: 'none'},
    );
  }
}
```
