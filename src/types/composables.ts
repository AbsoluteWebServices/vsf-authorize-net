import { ComputedProperty } from '@vue-storefront/core';
import {
  TokenBaseCard,
  TokenBaseCardCreateInput,
  TokenBaseCardUpdateInput,
  TokenBaseCheckoutConfig,
} from './';

export interface UseTokenBaseCardErrors {
  load: Error | null;
  create: Error | null;
  checkoutConfig: Error | null;
  update: Error | null;
  remove: Error | null;
}

export interface UseTokenBaseCard {
  results: ComputedProperty<TokenBaseCard[]>;
  config: ComputedProperty<TokenBaseCheckoutConfig | null>;
  loading: ComputedProperty<boolean>;
  error: ComputedProperty<UseTokenBaseCardErrors>;
  load: (params?: { hash: string }) => Promise<void>;
  create: (params: TokenBaseCardCreateInput) => Promise<void>;
  checkoutConfig: (params: { method: string }) => Promise<void>;
  update: (params: TokenBaseCardUpdateInput) => Promise<void>;
  remove: (params: { hash: string }) => Promise<void>;
}
