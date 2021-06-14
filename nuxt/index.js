import path from 'path';
import proxyMiddleware from './proxyMiddleware';

export default function (moduleOptions) {
  this.extendBuild((config) => {
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias['@absolute-web/vsf-authorize-net$'] = require.resolve('@absolute-web/vsf-authorize-net');
  });

  this.addPlugin({
    src: path.resolve(__dirname, './plugin.js'),
    moduleOptions,
  });

  this.addServerMiddleware({
    path: '/authnet/iframe-communicator',
    handler: proxyMiddleware()
  });
}
