export type Wallet = {
  name: string;
  address: string;
  encryptedPrivateKey: string;
  network: string;
};

export type DecryptedWallet = {
  name: string;
  address: string;
  privateKey: string;
  network: string;
};
