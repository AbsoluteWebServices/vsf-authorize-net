import { ApolloQueryResult } from '@apollo/client';
import { FetchResult } from '@apollo/client';
import {
  CreateTokenBaseCardOutput,
  DeleteTokenBaseCardOutput,
  TokenBaseCardsOutput,
  TokenBaseCheckoutConfigOutput,
  TokenBaseCardCreateInput,
  TokenBaseCardUpdateInput,
  UpdateTokenBaseCardOutput,
} from './';

export interface AuthnetApiMethods {
  tokenBaseCards(hash?: string): Promise<ApolloQueryResult<TokenBaseCardsOutput>>;
  tokenBaseCheckoutConfig(method: string): Promise<ApolloQueryResult<TokenBaseCheckoutConfigOutput>>;
  createTokenBaseCard(input: TokenBaseCardCreateInput): Promise<FetchResult<CreateTokenBaseCardOutput>>;
  deleteTokenBaseCard(hash: string): Promise<FetchResult<DeleteTokenBaseCardOutput>>;
  updateTokenBaseCard(input: TokenBaseCardUpdateInput): Promise<FetchResult<UpdateTokenBaseCardOutput>>;
}
