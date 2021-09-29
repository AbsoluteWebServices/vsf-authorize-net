import ApolloClient, { ApolloClientOptions } from 'apollo-client';

export interface ClientInstance<T = any> extends ApolloClient<T> {
}

export type ConfigState = {
  getCartId(): string;
  getCustomerToken(): string;
};

export interface ClientConfig {
  api: string;
  cookies: {
    cartCookieName: string;
    customerCookieName: string;
  },
  state: ConfigState;
}
export interface Config extends ClientConfig {
  client?: ClientInstance;
  customOptions?: ApolloClientOptions<any>;
}

