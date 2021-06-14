import defaultConfig from '@absolute-web/vsf-authorize-net/nuxt/defaultConfig';

export const mapConfigToSetupObject = ({ moduleOptions, app, additionalProperties = {} }) => ({
  ...defaultConfig,
  ...moduleOptions,
  ...additionalProperties,
});
