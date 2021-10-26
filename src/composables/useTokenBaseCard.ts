import { Context } from '@absolute-web/vsf-core';
import { TokenBaseCard, TokenBaseCheckoutConfig } from '../types';
import { useTokenBaseCardFactory, UseTokenBaseCardFactoryParams } from '../factories/useTokenBaseCardFactory';

const factoryParams: UseTokenBaseCardFactoryParams = {
  load: async (context: Context, params): Promise<TokenBaseCard[]> => {
    const result = await context.$authnet.api.tokenBaseCards(params?.hash);

    return result.data?.tokenBaseCards || [];
  },
  create: async (context: Context, params): Promise<TokenBaseCard | null> => {
    const result = await context.$authnet.api.createTokenBaseCard(params);

    return result.data?.createTokenBaseCard || null;
  },
  checkoutConfig: async (context: Context, { method }): Promise<TokenBaseCheckoutConfig | null> => {
    const result = await context.$authnet.api.tokenBaseCheckoutConfig(method);

    return result.data?.tokenBaseCheckoutConfig || null;
  },
  update: async (context: Context, params): Promise<TokenBaseCard | null> => {
    const result = await context.$authnet.api.updateTokenBaseCard(params);

    return result.data?.updateTokenBaseCard || null;
  },
  remove: async (context: Context, { hash }): Promise<boolean> => {
    const result = await context.$authnet.api.deleteTokenBaseCard(hash);

    return result.data?.deleteTokenBaseCard === true;
  },
};


export default useTokenBaseCardFactory(factoryParams);
