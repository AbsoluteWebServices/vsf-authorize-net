import { apiClientFactory } from '@vue-storefront/core';
import { APIContracts as ApiContracts } from 'authorizenet';
import * as api from './api';
import { ClientInstance, Config, ClientConfig } from './types/setup';

const defaultSettings: ClientConfig = {
  loginId: '',
  transactionKey: '',
};

const onCreate = (settings: Config): { config: Config; client: ClientInstance } => {
  const config = {
    ...defaultSettings,
    ...settings,
  } as unknown as Config;

  if (settings.client) {
    return {
      client: settings.client,
      config,
    };
  }

  const client = new ApiContracts.MerchantAuthenticationType({
    name: settings.loginId,
    transactionKey: settings.transactionKey
  });

  return {
    config,
    client,
  };
};

const { createApiClient } = apiClientFactory({
  onCreate,
  api,
});

export {
  createApiClient,
};
