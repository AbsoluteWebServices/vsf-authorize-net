import { Ref, computed } from 'vue-demi';
import {
  configureFactoryParams,
  Context,
  FactoryParams,
  Logger,
  sharedRef,
} from '@absolute-web/vsf-core';
import {
  TokenBaseCard,
  TokenBaseCardCreateInput,
  TokenBaseCardUpdateInput,
  TokenBaseCheckoutConfig,
  UseTokenBaseCard,
  UseTokenBaseCardErrors,
} from '../types';

export interface UseTokenBaseCardFactoryParams extends FactoryParams {
  load: (context: Context, params?: { hash: string }) => Promise<TokenBaseCard[]>;
  checkoutConfig: (context: Context, params: { method: string }) => Promise<TokenBaseCheckoutConfig | null>;
  create: (context: Context, params: TokenBaseCardCreateInput) => Promise<TokenBaseCard | null>;
  update: (context: Context, params: TokenBaseCardUpdateInput) => Promise<TokenBaseCard | null>;
  remove: (context: Context, params: { hash: string }) => Promise<boolean>;
}

export function useTokenBaseCardFactory(
  factoryParams: UseTokenBaseCardFactoryParams,
) {
  return function useTokenBaseCard(ssrKey = 'default'): UseTokenBaseCard {
    const results: Ref<TokenBaseCard[]> = sharedRef<TokenBaseCard[]>([], `useTokenBaseCard-${ssrKey}-results`);
    const config: Ref<TokenBaseCheckoutConfig | null> = sharedRef<TokenBaseCheckoutConfig | null>(null, `useTokenBaseCard-${ssrKey}-config`);
    const loading: Ref<boolean> = sharedRef<boolean>(false, `useTokenBaseCard-${ssrKey}-loading`);
    const error: Ref<UseTokenBaseCardErrors> = sharedRef({
      load: null,
      create: null,
      checkoutConfig: null,
      update: null,
      remove: null,
    }, `useTokenBaseCard-${ssrKey}-error`);
    // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
    const _factoryParams = configureFactoryParams(factoryParams);

    const load = async (params?: { hash: string }) => {
      Logger.debug(`useTokenBaseCard/${ssrKey}/load`, params);

      try {
        loading.value = true;
        results.value = await _factoryParams.load(params);
        error.value.load = null;
      } catch (err: any) {
        error.value.load = err;
        Logger.error(`useTokenBaseCard/${ssrKey}/load`, err);
      } finally {
        loading.value = false;
      }
    };

    const create = async (params: TokenBaseCardCreateInput) => {
      Logger.debug(`useTokenBaseCard/${ssrKey}/create`, params);

      try {
        loading.value = true;
        const result = await _factoryParams.create(params);
        error.value.create = null;

        if(result) {
          results.value.push(result);
        }
      } catch (err: any) {
        error.value.create = err;
        Logger.error(`useTokenBaseCard/${ssrKey}/create`, err);
      } finally {
        loading.value = false;
      }
    };

    const checkoutConfig = async (params: { method: string }) => {
      Logger.debug(`useTokenBaseCard/${ssrKey}/checkoutConfig`, params);

      try {
        loading.value = true;
        config.value = await _factoryParams.checkoutConfig(params);
        error.value.checkoutConfig = null;
      } catch (err: any) {
        error.value.checkoutConfig = err;
        Logger.error(`useTokenBaseCard/${ssrKey}/checkoutConfig`, err);
      } finally {
        loading.value = false;
      }
    };


    const update = async (params: TokenBaseCardUpdateInput) => {
      Logger.debug(`useTokenBaseCard/${ssrKey}/update`, params);

      try {
        loading.value = true;
        const result = await _factoryParams.update(params);
        error.value.update = null;

        if (result) {
          const index = results.value.findIndex(({ hash }) => hash === result.hash);
          results.value.splice(index, 1, result);
        }
      } catch (err: any) {
        error.value.update = err;
        Logger.error(`useTokenBaseCard/${ssrKey}/update`, err);
      } finally {
        loading.value = false;
      }
    };

    const remove = async (params: { hash: string }) => {
      Logger.debug(`useTokenBaseCard/${ssrKey}/remove`, params);

      try {
        loading.value = true;
        const result = await _factoryParams.remove(params);
        error.value.remove = null;

        if (result) {
          const index = results.value.findIndex(({ hash }) => hash === params.hash);
          results.value.splice(index, 1);
        }
      } catch (err: any) {
        error.value.remove = err;
        Logger.error(`useTokenBaseCard/${ssrKey}/remove`, err);
      } finally {
        loading.value = false;
      }
    };

    return {
      results: computed(() => results.value),
      config: computed(() => config.value),
      loading: computed(() => loading.value),
      error: computed(() => error.value),
      load,
      create,
      checkoutConfig,
      update,
      remove,
    };
  };
}
