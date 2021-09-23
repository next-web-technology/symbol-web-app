export type Block = {
  height: bigint;
  hash: string;
  timestamp: string;
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
