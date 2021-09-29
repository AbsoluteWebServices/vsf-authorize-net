import gql from 'graphql-tag';
import CustomerAddressData from './addressFragment';
import TokenBaseCardAdditionalData from './tokenBaseCardAdditionalFragment';

export default gql`
${CustomerAddressData}
${TokenBaseCardAdditionalData}

fragment TokenBaseCardData on TokenBaseCard {
  hash
  address {
    ...CustomerAddressData
  }
  customer_email
  customer_id
  customer_ip
  profile_id
  payment_id
  method
  active
  created_at
  updated_at
  last_use
  expires
  label
  additional {
    ...TokenBaseCardAdditionalData
  }
}`;
