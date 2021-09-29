import { FetchResult } from '@apollo/client';
import deleteTokenBaseCard from './deleteTokenBaseCard';
import { Context } from '../../types';

export default async (
  { client }: Context,
  hash: string
): Promise<FetchResult<boolean>> =>
  client.mutate({
    mutation: deleteTokenBaseCard,
    variables: { hash }
  });
