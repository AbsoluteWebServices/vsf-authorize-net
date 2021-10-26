import { ApiClientMethods, IntegrationContext } from '@absolute-web/vsf-core';
import { ClientInstance, Config, AuthnetApiMethods } from './types';

declare module '@absolute-web/vsf-core' {
  export interface Context {
    $authnet: IntegrationContext<ClientInstance, Config, ApiClientMethods<AuthnetApiMethods>>;
  }
}
