export type Account = {
  isValid: boolean;
  address: string;
  publicKey?: string;
  importance?: bigint;
};
