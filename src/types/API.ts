export interface HostedFormSettings {
  hostedPaymentReturnOptions?: {
    showReceipt?: boolean;
    url?: string;
    urlText?: string;
    cancelUrl?: string;
    cancelUrlText?: string;
  },
  hostedPaymentButtonOptions?: {
    text?: string;
  },
  hostedPaymentStyleOptions?: {
    bgColor?: string;
  },
  hostedPaymentPaymentOptions?: {
    cardCodeRequired?: boolean;
    showCreditCard?: boolean;
    showBankAccount?: boolean;
    customerProfileId?: number | false;
  },
  hostedPaymentVisaCheckoutOptions?: {
    apiKey?: string;
    displayName?: string;
    message?: string;
  },
  hostedPaymentSecurityOptions?: {
    captcha?: boolean;
  },
  hostedPaymentShippingAddressOptions?: {
    show?: boolean;
    required?: boolean;
  },
  hostedPaymentBillingAddressOptions?: {
    show?: boolean;
    required?: boolean;
  },
  hostedPaymentCustomerOptions?: {
    showEmail?: boolean;
    requiredEmail?: boolean;
    addPaymentProfile?: boolean;
  },
  hostedPaymentOrderOptions?: {
    show?: boolean;
    merchantName?: string;
  },
  hostedPaymentIFrameCommunicatorUrl?: {
    url?: string;
  }
}

export interface GetAnAcceptPaymentPageInput {
  amount: number;
  settings: HostedFormSettings;
}

export interface AcceptPaymentPage {
  token: string;
  message: string;
}

export interface CreateTransactionInput {
  amount: number;
  opaqueData: any;
}

export interface Transaction {
}

export interface AuthorizeNetApiMethods {
  getAnAcceptPaymentPage(input: GetAnAcceptPaymentPageInput): Promise<AcceptPaymentPage>;
  createTransaction(input: CreateTransactionInput): Promise<Transaction>;
}
