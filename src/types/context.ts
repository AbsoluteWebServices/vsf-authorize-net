import { ApiClientMethods, IntegrationContext } from '@vue-storefront/core';
import { ClientInstance, Config } from './setup';
import { AuthnetApiMethods } from './api';

export type Context = IntegrationContext<ClientInstance, Config, ApiClientMethods<AuthnetApiMethods>>;