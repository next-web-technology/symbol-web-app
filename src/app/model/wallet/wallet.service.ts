import { Injectable } from '@angular/core';
import { NodeService } from '../node/node.service';
import { WalletInfrastructureService } from './wallet-infrastructure.service';
import { DecryptedWallet, Wallet } from './wallet.model';

export interface InterfaceWalletInfrastructureService {
  setWalletWithPrivateKey: (
    name: string,
    address: string,
    privateKey: string,
    password: string
  ) => Promise<void>;
  getWallets: (network: string) => Promise<Wallet[]>;
  getWallet: (name: string) => Promise<Wallet | undefined>;
  openWallet: (
    name: string,
    password: string
  ) => Promise<DecryptedWallet | undefined>;
  removeAllWallet: () => Promise<void>;
  removeWallet: (name: string) => Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(
    private walletInfrastructureService: WalletInfrastructureService,
    private nodeService: NodeService
  ) {}

  async setWalletWithPrivateKey(
    name: string,
    address: string,
    privateKey: string,
    password: string
  ) {
    await this.walletInfrastructureService.setWalletWithPrivateKey(
      name,
      address,
      privateKey,
      password
    );
  }

  async getWallets(): Promise<Wallet[]> {
    const network = this.nodeService.network$.getValue();
    return this.walletInfrastructureService.getWallets(network);
  }

  async getWallet(name: string): Promise<Wallet | undefined> {
    return this.walletInfrastructureService.getWallet(name);
  }

  async openWallet(
    name: string,
    password: string
  ): Promise<DecryptedWallet | undefined> {
    return this.walletInfrastructureService.openWallet(name, password);
  }

  async removeAllWallet(): Promise<void> {
    await this.walletInfrastructureService.removeAllWallet();
  }

  async removeWallet(name: string): Promise<void> {
    await this.walletInfrastructureService.removeWallet(name);
  }
}
