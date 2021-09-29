import gql from 'graphql-tag';
import TokenBaseCheckoutConfigData from '../../fragments/tokenBaseCheckoutConfigFragment';

export default gql`
${TokenBaseCheckoutConfigData}

query tokenBaseCheckoutConfig($method: String!) {
  tokenBaseCheckoutConfig(method: $method) {
    ...TokenBaseCheckoutConfigData
  }
}
`;
