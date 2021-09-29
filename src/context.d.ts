import { ApiClientMethods, IntegrationContext } from '@vue-storefront/core';
import { ClientInstance, Config, AuthnetApiMethods } from './types';

declare module '@vue-storefront/core' {
  export interface Context {
    $authnet: IntegrationContext<ClientInstance, Config, ApiClientMethods<AuthnetApiMethods>>;
  }
}
