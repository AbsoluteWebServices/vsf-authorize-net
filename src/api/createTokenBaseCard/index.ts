import { FetchResult } from '@apollo/client';
import createTokenBaseCard from './createTokenBaseCard';
import { Context, TokenBaseCard, TokenBaseCardCreateInput } from '../../types';

export default async (
  { client }: Context,
  input: TokenBaseCardCreateInput
): Promise<FetchResult<TokenBaseCard>> =>
  client.mutate({
    mutation: createTokenBaseCard,
    variables: { input }
  });
