import gql from 'graphql-tag';

export default gql`
mutation deleteTokenBaseCard($hash: String!) {
  deleteTokenBaseCard(hash: $hash)
}
`;
