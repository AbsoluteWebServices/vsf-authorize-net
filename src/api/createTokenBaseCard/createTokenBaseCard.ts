import gql from 'graphql-tag';
import TokenBaseCardData from '../../fragments/tokenBaseCardFragment';

export default gql`
${TokenBaseCardData}

mutation createTokenBaseCard($input: TokenBaseCardCreateInput!) {
  createTokenBaseCard(input: $input) {
    ...TokenBaseCardData
  }
}
`;
