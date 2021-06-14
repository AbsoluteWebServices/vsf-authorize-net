import {
  Context,
} from '@vue-storefront/core';
import { HostedFormSettings, GetAnAcceptPaymentPageInput } from '../types/API';
import { useHostedFormFactory, UseHostedFormFactoryParams } from '../factories/useHostedFormFactory';

const defaultSettings: HostedFormSettings = {
  hostedPaymentPaymentOptions: {
    showBankAccount: false
  },
  hostedPaymentOrderOptions: {
    show: false
  },
  hostedPaymentBillingAddressOptions: {
    show: false
  },
  hostedPaymentShippingAddressOptions: {
    show: false
  },
  hostedPaymentReturnOptions: {
    showReceipt: false
  }
};

const factoryParams: UseHostedFormFactoryParams = {
  loadFormToken: async (context: Context, { amount, settings: overridenSettings }: GetAnAcceptPaymentPageInput) => {
    const input: GetAnAcceptPaymentPageInput = {
      amount,
      settings: {
        ...defaultSettings,
        ...overridenSettings,
      },
    };

    const response = await context.$authnet.api.getAnAcceptPaymentPage(input);

    return response?.token;
  },
};

export default useHostedFormFactory(factoryParams);
