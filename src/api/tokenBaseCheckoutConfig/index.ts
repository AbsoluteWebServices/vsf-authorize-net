import { ApolloQueryResult } from '@apollo/client';
import tokenBaseCheckoutConfig from './tokenBaseCheckoutConfig';
import { Context, TokenBaseCheckoutConfig } from '../../types';

export default async (
  { client }: Context,
  method: string
): Promise<ApolloQueryResult<TokenBaseCheckoutConfig>> =>
  client.query({
    query: tokenBaseCheckoutConfig,
    variables: { method },
    fetchPolicy: 'no-cache'
  });
