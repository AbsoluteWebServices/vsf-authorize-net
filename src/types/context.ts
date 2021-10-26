import { ApiClientMethods, IntegrationContext } from '@absolute-web/vsf-core';
import { ClientInstance, Config } from './setup';
import { AuthnetApiMethods } from './api';

export type Context = IntegrationContext<ClientInstance, Config, ApiClientMethods<AuthnetApiMethods>>;
