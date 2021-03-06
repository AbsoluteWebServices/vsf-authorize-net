/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { URL } from 'url';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from } from '@apollo/client';
import fetch from 'isomorphic-fetch';
import { stripIgnoredCharacters } from 'graphql';
import { Logger } from '@absolute-web/vsf-core';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { setContext } from '@apollo/client/link/context';
import { handleRetry } from './linkHandlers';
import { Config } from '../../types/setup';

const createErrorHandler = () => onError(({
  graphQLErrors,
  networkError,
}) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({
      message,
      locations,
      path,
    }) => {
      if (!message.includes('Resource Owner Password Credentials Grant')) {
        if (!locations) {
          Logger.error(`[GraphQL error]: Message: ${message}, Path: ${path}`);
          return;
        }

        const parsedLocations = locations.map(({
          column,
          line,
        }) => `[column: ${column}, line: ${line}]`);

        Logger.error(`[GraphQL error]: Message: ${message}, Location: ${parsedLocations.join(', ')}, Path: ${path}`);
      }
    });
  }

  if (networkError) {
    Logger.error(`[Network error]: ${networkError}`);
  }
});

const strippedUrl = (currentUrl: string) => {
  const url = new URL(currentUrl);
  const query = url.searchParams.get('query');

  if (!query) {
    return currentUrl;
  }

  const minifiedQuery = stripIgnoredCharacters(query);

  url.searchParams.set('query', minifiedQuery);

  return url.toString();
}

export const apolloLinkFactory = (settings: Config, handlers?: {
  authLink?: ApolloLink;
}) => {
  const baseAuthLink = handlers?.authLink || setContext((apolloReq, { headers }) => ({
    headers: {
      ...headers,
    },
  }));

  const httpLink = new HttpLink({
    useGETForQueries: true,
    uri: settings.api,
    fetch: (url: string, options: any) => fetch(strippedUrl(url), options)
  });

  const onErrorLink = createErrorHandler();

  const errorRetry = new RetryLink({
    attempts: handleRetry(),
    delay: () => 0,
  });

  // eslint-disable-next-line unicorn/prefer-spread
  return from([onErrorLink, errorRetry, baseAuthLink.concat(httpLink)]);
};

export const apolloClientFactory = (customOptions: Record<string, any>) => new ApolloClient({
  cache: new InMemoryCache(),
  ...customOptions,
});
