import { integrationPlugin } from '@vue-storefront/core'

const moduleOptions = JSON.parse('<%= JSON.stringify(options) %>');

const defaultConfig = {
  loginId: '',
  clientKey: ''
};

export default integrationPlugin(({ app, integration }) => {
  const settings = {
    ...defaultConfig,
    ...moduleOptions,
  };

  integration.configure('authnet', settings);
});
