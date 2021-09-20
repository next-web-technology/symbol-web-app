export type Account = {
  isValid: boolean;
  address: string;
  publicKey?: string;
  importance?: bigint;
  relativeImportance?: number;
};

export type AccountSearchCriteria = {
  pageSize: number;
  pageNumber: number;
};
