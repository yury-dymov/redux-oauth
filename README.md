# redux-oauth
Bearer token-based authentication library with omniauth support for redux applications

# Full example
### Universal / Isomorphic use-case
[Live demo](https://yury-dymov.github.io/redux-oauth-client-demo)
[Source code](https://github.com/yury-dymov/redux-oauth-demo)

### Client-side only
[Live demo](https://yury-dymov.github.io/redux-oauth-client-demo)
[Source code](https://github.com/yury-dymov/redux-oauth-client-demo)

### Backend 
[Backend source code](https://github.com/yury-dymov/redux-oauth-backend-demo)

# Notes on migration from 1.x version
First version is based and fully compatible with [Redux-Auth](https://github.com/lynndylanhurley/redux-auth). Support is discontinued.

Second version is more simple to configure and more stable. All React Components were also extracted to separate packages, therefore React is removed from dependencies.

# Features
* Implements Bearer token-based authentication for your application to talk to 3d party APIs
* Provides universal fetch method for any HTTP/HTTPS calls both client and server side
* Supports OAuth2
* Supports server-side rendering to make users and search engines happy. This means that page, which require several API requests, can be fully or partly rendered on the server first

# Configuration
### Universal / Isomorphic use-case
Configuration is required only on server-side. Client will fetch configuration and latest authentication data from redux initial state.

1. Add authStateReducer to your reducer as 'auth'
2. Dispatch initialize method with your configuration, cookies and current location before rendering step
3. Update cookies. In case javascript fails to load / initialize user session will be still valid

### Client-only use-case
1. Add authStateReducer to your reducer as 'auth'
2. Dispatch initialize method with your configuration and current location before rendering step

# Usage
Dispatch fetch action with any Url and [fetch API](https://github.com/github/fetch/) options. If it is an API request, than authentication headers are applied
prior the request and token value in redux store and browser cookies is updated right after. Otherwise, regular request is performed.

# Workflow
### Universal / Isomorphic use-case
1. Browser sends request to the web-application. Initial credentials are provided within cookies
2. Server performs validateToken API request to check the provided credentials and load user information
3. Server performs desired API requests and each times update authentication information in redux store if required
4. Server sends content to the client. Most recent authentication information is sent within native http 'setCookie' method to ensure session persistence.
5. Client loads and initialize javascript. Redux initial state is loaded from markup including redux-oauth configuration, latest authentication information and user data

### Client-only use-case
1. Client dispatch initialize action to setup configuration and initial authentication data
2. Client performs validateToken API request to check credentials and load user data

# Configuration Options
### cookies
Provide request cookies for initial authentication information. Optional

### currentLocation
Provide current url. MANDATORY to process OAuth callbacks properly.

### backend
apiUrl - MANDATORY, base url to your API

tokenValidationPath - path to validate token, default: `/auth/validate_token`

signOutPath - path to sign out from backend, default: `/auth/sign_out`

authProviderPaths - configuration for OAuth2 providers, default: {}

### cookieOptions
key - cookie key for storing authentication headers for persistence, default: 'authHeaders'

path - cookie path, default: '/'

expire - cookie expiration in days, default: 14

### tokenFormat
authentication data structure, which is going back and forth between backend and client

Access-Token - no default value

Token-Type - default value: 'Bearer',

Client - no default value

Expiry - no default value

Uid - no default value

Authorization - default value: '{{ Token-Type } { Access-Token }}'. This expression means that default value is computed using current 'Token-Type' and 'Access-Token' values.

Unlike 'backend' and 'cookieOptions' objects if you would like to override tokenFormat, you have to provide whole structure.

## Example
#### server.js with Express
```
import { initialize, authStateReducer } from "redux-auth";

// ...

const rootReducer = combineReducers({
    auth: authStateReducer,
    // ... add your own reducers here
});

app.use((req, res) => {
    const store = createStore(rootReducer, {}, applyMiddleware(thunk));

    store.dispatch(initialize({
        backend: {
            apiUrl: 'https://my-super-api.zone',
            authProviderPaths: {
                facebook: '/auth/facebook',
                github: '/auth/github'
            }
        },
        currentLocation: request.url,
        cookies: request.cookies
    }).then(() => {
        // ... do your regular things like routing and rendering

        // We need to update browser headers. User will still have valid session in case javascript fails 
        // 'authHeaders' is default cookieOptions.key value bere. If you redefined it, use your value instead
        res.cookie('authHeaders', JSON.stringify(getHeaders(store.getState())), { maxAge: ... });
    })
}
```

# Email-password authentication and other use-cases
I wanted to make library as light-weight as possible. Also many folks have very different use-cases so it is hard to satisfy everyone. Therefore it is considered that everyone can easily implement methods they need themselves.
 
#### Email-password authentication method example

```
import { fetch, authenticateStart, authenticateComplete, authenticateError, parseResponse } from 'redux-oauth';

function signIn(email, password) {
    return dispatch => {
        dispatch(authenticateStart());
        
        return dispatch(fetch(yourCustomAuthMethod(email, password)))
            .then(parseResponse)
            .then(user => {
                dispatch(authenticateComplete(user));
                
                // it is recommended to return resolve or reject for server side rendering case. 
                // It helps to know then all requests are finished and rendering can be performed
                return Promise.resolve(user);
            }
            .catch(error => {
                if (error.errors) {
                    dispatch(authenticateError(error.errors));
                }
                
                return Promise.reject(error.errors || error);
            };
    };
}

```

# License
MIT (c) Yuri Dymov
