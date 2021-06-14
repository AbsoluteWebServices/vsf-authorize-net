import { ComputedProperty } from '@vue-storefront/core';
import { GetAnAcceptPaymentPageInput } from './API';


export interface UseHostedForm {
  loading: ComputedProperty<boolean>;
  error: ComputedProperty<UseHostedFormErrors>;
  formToken: ComputedProperty<string>;
  loadFormToken: (input: GetAnAcceptPaymentPageInput) => Promise<void>;
}

export interface UseHostedFormErrors {
  loadFormToken: Error;
}
