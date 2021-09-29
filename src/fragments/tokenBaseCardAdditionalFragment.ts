import gql from 'graphql-tag';

export default gql`
fragment TokenBaseCardAdditionalData on TokenBaseCardAdditional {
  cc_type
  cc_owner
  cc_bin
  cc_last4
  cc_exp_year
  cc_exp_month
  echeck_account_name
  echeck_bank_name
  echeck_account_type
  echeck_routing_number_last4
  echeck_account_number_last4
}`;
