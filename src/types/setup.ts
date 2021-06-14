
export interface ClientConfig {
  loginId: string;
  transactionKey: string,
}

export interface Config extends ClientConfig {
  client?: any;
}

export interface ClientInstance {
}
