import { integrationPlugin } from '@vue-storefront/core'
import { mapConfigToSetupObject } from '@absolute-web/vsf-authorize-net/nuxt/helpers';

const moduleOptions = JSON.parse('<%= JSON.stringify(options) %>');

export default integrationPlugin(({ app, integration }) => {
  const settings = mapConfigToSetupObject({
    moduleOptions,
    app
  });

  integration.configure('authnet', settings);
});
