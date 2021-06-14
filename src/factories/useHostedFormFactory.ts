import { Ref, computed } from 'vue-demi';
import {
  configureFactoryParams,
  Context,
  FactoryParams,
  Logger,
  sharedRef,
} from '@vue-storefront/core';
import { UseHostedForm, UseHostedFormErrors } from '../types/composables';
import { GetAnAcceptPaymentPageInput } from '../types/API';

export interface UseHostedFormFactoryParams extends FactoryParams{
  loadFormToken: (context: Context, input: GetAnAcceptPaymentPageInput) => Promise<string>;
}

export function useHostedFormFactory(
  factoryParams: UseHostedFormFactoryParams,
) {
  return function useHostedForm(ssrKey = 'useHostedFormFactory'): UseHostedForm {
    // @ts-ignore
    const loading: Ref<boolean> = sharedRef<boolean>(false, `useHostedForm-loading-${ssrKey}`);
    const formToken: Ref<string> = sharedRef<string>('', `useHostedForm-formToken-${ssrKey}`);
    const error: Ref<UseHostedFormErrors> = sharedRef({
      loadFormToken: null,
    }, 'useHostedForm-error');
    // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
    const _factoryParams = configureFactoryParams(factoryParams);

    const loadFormToken = async (input: GetAnAcceptPaymentPageInput) => {
      Logger.debug(`useHostedForm/${ssrKey}/loadFormToken`);
      loading.value = true;

      try {
        formToken.value = await _factoryParams.loadFormToken(input);
        error.value.loadFormToken = null;
      } catch(err) {
        error.value.loadFormToken = err;
        Logger.error('useHostedForm/loadFormToken', err);
      } finally {
        loading.value = false;
      }
    };

    return {
      formToken,
      loading: computed(() => loading.value),
      error: computed(() => error.value),
      loadFormToken,
    };
  };
}
