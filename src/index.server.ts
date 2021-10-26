import { ApiClientExtension, apiClientFactory } from '@absolute-web/vsf-core';
import * as api from './api';
import { ClientInstance, Config } from './types/setup';
import { createMagentoConnection } from './helpers/magentoLink';
import { defaultSettings } from './helpers/apiClient/defaultSettings';
import { apolloClientFactory } from './helpers/magentoLink/graphQl';

const onCreate = (settings: Config): { config: Config; client: ClientInstance } => {
  const config = {
    ...defaultSettings,
    ...settings,
    state: settings.state || defaultSettings.state,
  } as unknown as Config;

  if (settings.client) {
    return {
      client: settings.client,
      config,
    };
  }

  if (settings.customOptions && settings.customOptions.link) {
    return {
      client: apolloClientFactory(settings.customOptions),
      config,
    };
  }

  const { apolloLink } = createMagentoConnection(config);

  const client = apolloClientFactory({
    link: apolloLink,
    ...settings.customOptions,
  });

  return {
    config,
    client,
  };
};

const tokenExtension: ApiClientExtension = {
  name: 'tokenExtension',
  hooks: (req, res) => ({
    beforeCreate: ({ configuration }) => {
      const cartCookieName = configuration.cookies?.cartCookieName || defaultSettings.cookies.cartCookieName;
      const customerCookieName = configuration.cookies?.customerCookieName || defaultSettings.cookies.customerCookieName;

      return {
        ...configuration,
        state: {
          getCartId: () => req.cookies[cartCookieName],
          getCustomerToken: () => req.cookies[customerCookieName],
        },
      };
    }
  }),
};

const { createApiClient } = apiClientFactory({
  onCreate,
  api,
  extensions: [tokenExtension],
});

export {
  createApiClient
};
