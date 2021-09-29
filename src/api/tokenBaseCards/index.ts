import { ApolloQueryResult } from 'apollo-client';
import tokenBaseCards from './tokenBaseCards';
import { Context, TokenBaseCard } from '../../types';

export default async (
  { client }: Context,
  hash?: string
): Promise<ApolloQueryResult<TokenBaseCard[]>> =>
  client.query({
    query: tokenBaseCards,
    variables: { hash },
    fetchPolicy: 'no-cache'
  });
