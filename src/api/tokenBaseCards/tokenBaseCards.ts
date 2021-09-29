import gql from 'graphql-tag';
import TokenBaseCardData from '../../fragments/tokenBaseCardFragment';

export default gql`
${TokenBaseCardData}

query tokenBaseCards($hash: String) {
  tokenBaseCards(hash: $hash) {
    ...TokenBaseCardData
  }
}
`;
