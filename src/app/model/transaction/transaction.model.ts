import { Mosaic } from 'src/app/model/mosaic/mosaic.model';
import { Wallet } from 'src/app/model/wallet/wallet.model';

export type TransferXYMWithPlainMessageTransaction = {
  wallet: Wallet;
  mosaics: Mosaic[];
  address: string;
  relativeAmount: number;
  message: string;
  password: string;
};

export type Transaction = TransferXYMWithPlainMessageTransaction;

export type SignedTransaction = {
  transaction: Transaction;
  payload?: string;
  hash?: string;
  signerPublicKey?: string;
};

export type TransactionAnnounceResponse = {
  message: string;
  hash?: string;
};

export type TransactionStatus =
  | 'Not Found'
  | 'Unconfirmed'
  | 'Confirmed'
  | 'Finalized';

export type TransactionMonitorResponse = {
  hash: string;
  status: TransactionStatus;
};
