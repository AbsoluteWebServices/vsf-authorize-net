import { FetchResult } from '@apollo/client';
import updateTokenBaseCard from './updateTokenBaseCard';
import { Context, TokenBaseCard, TokenBaseCardUpdateInput } from '../../types';

export default async (
  { client }: Context,
  input: TokenBaseCardUpdateInput
): Promise<FetchResult<TokenBaseCard>> =>
  client.mutate({
    mutation: updateTokenBaseCard,
    variables: { input }
  });
