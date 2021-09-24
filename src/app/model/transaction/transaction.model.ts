export type TransferXYMTransactionWithPlainMessage = {
  type: 'Transfer XYM With Plain Message';
  fromAddress: string;
  toAddress: string;
  relativeAmount: number;
  message?: string;
  fee?: bigint;
  hash?: string;
};

export type TransferXYMTransactionWithEncryptedMessage = {
  type: 'Transfer XYM With Encrypted Message';
  fromAddress: string;
  toAddress: string;
  relativeAmount: number;
  plainMessage?: string;
  encryptedMessage?: string;
  fee?: bigint;
  hash?: string;
};

export type TransferMosaicsTransactionWithPlainMessage = {
  type: 'Transfer XYM With Plain Message';
  fromAddress: string;
  toAddress: string;
  mosaics: {
    amount: bigint;
    mosaicId: string;
    divisibility: number;
  }[];
  message?: string;
  fee?: bigint;
  hash?: string;
};

export type TransferMosaicsTransactionWithEncryptedMessage = {
  type: 'Transfer XYM With Encrypted Message';
  fromAddress: string;
  toAddress: string;
  mosaics: {
    amount: bigint;
    mosaicId: string;
    divisibility: number;
  }[];
  plainMessage?: string;
  encryptedMessage?: string;
  fee?: bigint;
  hash?: string;
};

export type Transaction =
  | TransferXYMTransactionWithPlainMessage
  | TransferXYMTransactionWithEncryptedMessage
  | TransferMosaicsTransactionWithPlainMessage
  | TransferMosaicsTransactionWithEncryptedMessage;

export type SignedTransaction = {
  transaction: Transaction;
  signature?: string;
};
