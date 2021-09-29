import gql from 'graphql-tag';
import TokenBaseCardData from '../../fragments/tokenBaseCardFragment';

export default gql`
${TokenBaseCardData}

mutation updateTokenBaseCard($input: TokenBaseCardUpdateInput!) {
  updateTokenBaseCard(input: $input) {
    ...TokenBaseCardData
  }
}
`;
