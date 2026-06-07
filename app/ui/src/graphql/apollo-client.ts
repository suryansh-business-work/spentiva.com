import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getGraphqlUrl } from '../config/api';
import { getAuthToken } from '../utils/localStorage';

let tokenExpiredCallback: (() => void) | null = null;

/** Registered by the app to surface the "session expired" modal on UNAUTHENTICATED. */
export const setGraphqlTokenExpiredCallback = (callback: () => void) => {
  tokenExpiredCallback = callback;
};

const httpLink = createHttpLink({ uri: getGraphqlUrl() });

const authLink = setContext((_, { headers }) => {
  const token = getAuthToken();
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors?.some((err) => err.extensions?.code === 'UNAUTHENTICATED')) {
    tokenExpiredCallback?.();
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
