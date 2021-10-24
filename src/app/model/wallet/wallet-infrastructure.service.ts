import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { BehaviorSubject } from 'rxjs';
import { first, mergeMap } from 'rxjs/operators';
import * as symbolSdk from 'symbol-sdk';
import { AccountService } from '../account/account.service';
import { NodeService } from '../node/node.service';
import { DecryptedWallet, Wallet } from './wallet.model';
import { InterfaceWalletInfrastructureService } from './wallet.service';

@Injectable({
  providedIn: 'root',
})
export class WalletInfrastructureService
  implements InterfaceWalletInfrastructureService
{
  private repositoryFactoryHttp$?: BehaviorSubject<symbolSdk.RepositoryFactoryHttp>;
  private networkRepository$?: BehaviorSubject<symbolSdk.NetworkRepository>;
  private networkType$?: BehaviorSubject<symbolSdk.NetworkType>;
  private db: Dexie;

  constructor(
    private nodeService: NodeService,
    private accountService: AccountService
  ) {
    // Todo: IndexedDB Service should be divided to another Service
    this.db = new Dexie('symbol-web-app');
    this.db.version(1).stores({
      wallets: '++index, &name, &address, encryptedPrivateKey, network',
    });

    this.nodeService.nodeUrl$?.subscribe((nodeUrl) => {
      if (this.repositoryFactoryHttp$ instanceof BehaviorSubject) {
        this.repositoryFactoryHttp$ = new BehaviorSubject(
          new symbolSdk.RepositoryFactoryHttp(nodeUrl)
        );
      } else {
        this.repositoryFactoryHttp$ = new BehaviorSubject(
          new symbolSdk.RepositoryFactoryHttp(nodeUrl)
        );
      }
      if (this.networkRepository$ instanceof BehaviorSubject) {
        this.networkRepository$.next(
          this.repositoryFactoryHttp$.getValue().createNetworkRepository()
        );
      } else {
        this.networkRepository$ = new BehaviorSubject(
          this.repositoryFactoryHttp$.getValue().createNetworkRepository()
        );
      }
      this.networkRepository$
        .pipe(
          mergeMap((networkRepository) => networkRepository.getNetworkType())
        )
        .subscribe((networkType) => {
          if (this.networkType$ instanceof BehaviorSubject) {
            this.networkType$.next(networkType);
          } else {
            this.networkType$ = new BehaviorSubject(networkType);
          }
        });
    });
  }

  async setWalletWithPrivateKey(
    name: string,
    address: string,
    privateKey: string,
    password: string
  ): Promise<void> {
    this.networkType$?.pipe(first()).subscribe(async (networkType) => {
      if (this.networkType$ === undefined) {
        throw Error('network type is unknown!');
      }
      const network =
        this.networkType$.getValue() === symbolSdk.NetworkType.MAIN_NET
          ? 'mainnet'
          : this.networkType$.getValue() === symbolSdk.NetworkType.TEST_NET
          ? 'testnet'
          : 'unknown';
      const isValidAddress = this.accountService.checkAddressIsValid(address);
      if (!isValidAddress) {
        throw Error('Invalid Address!');
      }
      const validatedAddress = symbolSdk.Address.createFromRawAddress(address);
      const restoredAddress = symbolSdk.Account.createFromPrivateKey(
        privateKey,
        this.networkType$.getValue()
      );
      if (restoredAddress.address.plain() !== validatedAddress.plain()) {
        throw Error('Private Key does not match to Address!');
      }
      const simpleWallet = symbolSdk.SimpleWallet.createFromPrivateKey(
        name,
        new symbolSdk.Password(password),
        privateKey,
        this.networkType$.getValue()
      );
      const wallet: Wallet = {
        name: simpleWallet.name,
        address: simpleWallet.address.plain(),
        encryptedPrivateKey: simpleWallet.encryptedPrivateKey,
        network,
      };
      await this.db.table('wallets').put(wallet);
    });
  }

  async getWallets(network: string): Promise<Wallet[]> {
    return await this.db.table('wallets').where({ network: network }).toArray();
  }

  async getWallet(name: string): Promise<Wallet | undefined> {
    try {
      return await this.db.table('wallets').get({ name });
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async openWallet(
    name: string,
    password: string
  ): Promise<DecryptedWallet | undefined> {
    const wallet = await this.getWallet(name);
    if (wallet !== undefined) {
      const symbolSdkWallet = new symbolSdk.SimpleWallet(
        wallet.name,
        symbolSdk.Address.createFromRawAddress(wallet.address),
        wallet.encryptedPrivateKey
      );
      const symbolSdkAccount = symbolSdkWallet.open(
        new symbolSdk.Password(password)
      );
      const decryptedWallet: DecryptedWallet = {
        name: wallet.name,
        address: symbolSdkAccount.address.plain(),
        privateKey: symbolSdkAccount.privateKey.toString(),
        network: wallet.network,
      };
      return decryptedWallet;
    } else {
      return undefined;
    }
  }

  async removeAllWallet(): Promise<void> {
    await this.db.table('wallets').clear();
  }

  async removeWallet(name: string): Promise<void> {
    await this.db.table('wallets').delete(name);
  }
}
