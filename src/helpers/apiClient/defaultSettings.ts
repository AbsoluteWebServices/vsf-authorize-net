import { ClientConfig } from '../../types/setup';

export const defaultSettings: ClientConfig = {
  api: '',
  cookies: {
    cartCookieName: 'vsf-cart',
    customerCookieName: 'vsf-customer',
  },
  state: {
    getCartId: () => '',
    getCustomerToken: () => '',
  },
};
