module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
    commonjs: true,
  },
  parser: 'vue-eslint-parser',
  extends: [
    '@vue-storefront/eslint-config-base',
    '@vue-storefront/eslint-config-import',
    '@vue-storefront/eslint-config-vue',
  ],
}
