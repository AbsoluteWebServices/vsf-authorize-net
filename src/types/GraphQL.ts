import { CustomerAddress, CustomerAddressInput } from '@vue-storefront/magento-api';

type CCData = {
  cc_type: string;
  cc_owner: string;
  cc_bin: string;
  cc_last4: string;
  cc_exp_year: string;
  cc_exp_month: string;
}

type ACHData = {
  echeck_account_name: string;
  echeck_bank_name: string;
  echeck_account_type: string;
  echeck_routing_number_last4: string;
  echeck_account_number_last4: string;
}

export type TokenBaseCardAdditional = CCData & ACHData;

export type TokenBaseCard = {
  hash: string;
  address: CustomerAddress;
  customer_email: string;
  customer_id: number
  customer_ip: string;
  profile_id: string;
  payment_id: string;
  method: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  last_use: string;
  expires: string;
  label: string;
  additional: TokenBaseCardAdditional;
}

export type TokenBaseKeyValue = {
  key: string;
  value: string;
}

export type TokenBaseCheckoutConfig = {
  method: string;
  useVault: boolean;
  canSaveCard: boolean;
  forceSaveCard: boolean;
  defaultSaveCard: boolean;
  isCcDetectionEnabled: boolean;
  logoImage: string;
  requireCcv: boolean;
  sandbox: boolean;
  canStoreBin: boolean;
  availableTypes: TokenBaseKeyValue[];
  months: TokenBaseKeyValue[];
  years: TokenBaseKeyValue[];
  hasVerification: boolean;
  cvvImageUrl: string;
}

type CCPaymentInput = CCData & {
  cc_number: string;
  cc_cid: string;
}

type ACHPaymentInput = {
  echeck_account_name: string;
  echeck_bank_name: string;
  echeck_account_type: string;
  echeck_routing_number: string;
  echeck_account_number: string;
}

export type TokenBaseCardPaymentInput = Partial<CCPaymentInput> & Partial<ACHPaymentInput> & {
  acceptjs_key: string;
  acceptjs_value: string;
  save?: boolean;
  card_id?: string;
}

export type TokenBaseCardCreateInput = {
  address?: CustomerAddressInput;
  customer_email: string;
  customer_ip?: string;
  method: string;
  active?: boolean;
  expires?: string;
  additional?: TokenBaseCardPaymentInput;
}

export type TokenBaseCardUpdateInput = TokenBaseCardCreateInput & {
  hash: string;
}


export type TokenBaseCardsOutput = {
  tokenBaseCards: TokenBaseCard[];
}

export type TokenBaseCheckoutConfigOutput = {
  tokenBaseCheckoutConfig: TokenBaseCheckoutConfig;
}

export type CreateTokenBaseCardOutput = {
  createTokenBaseCard: TokenBaseCard;
}

export type DeleteTokenBaseCardOutput = {
  deleteTokenBaseCard: boolean;
}

export type UpdateTokenBaseCardOutput = {
  updateTokenBaseCard: TokenBaseCard;
}
