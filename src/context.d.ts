import { IntegrationContext, ApiClientMethods } from '@vue-storefront/core';
import { ClientInstance, Config, AuthorizeNetApiMethods } from './types';

declare module '@vue-storefront/core' {
  export interface Context {
    $authnet: IntegrationContext<ClientInstance, Config, ApiClientMethods<AuthorizeNetApiMethods>>;
  }
}
