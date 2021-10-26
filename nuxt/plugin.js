import { integrationPlugin } from '@absolute-web/vsf-core'

const moduleOptions = JSON.parse('<%= JSON.stringify(options) %>');

const defaultConfig = {
  loginId: '',
  clientKey: '',
  environment: 'development'
};

export default integrationPlugin(({ app, integration }) => {
  const settings = {
    ...defaultConfig,
    ...moduleOptions,
  };

  integration.configure('authnet', settings);
});
