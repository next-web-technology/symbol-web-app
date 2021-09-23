export type Block = {
  height: bigint;
  hash: string;
  timestamp: string;
  date?: Date;
  beneficiaryAddress?: string;
  signerAddress?: string;
  fee?: bigint;
  transactionsCount?: number;
  totalTransactionsCount?: number;
};

export type Blocks = {
  data: Block[];
  latestFinalizedBlockHeight: bigint;
  latestBlockHeight: bigint;
  pageSize: number;
  pageNumber: number;
};

export type BlockSearchCriteria = {
  signerPublicKey?: string;
  beneficiaryAddress?: string;
  pageSize?: number;
  pageNumber?: number;
  order?: string;
  orderBy?: string;
};
