import { Injectable } from '@angular/core';
import { NodeService } from '../node/node.service';
import * as symbolSdk from 'symbol-sdk';
import { BehaviorSubject, Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Account, AccountSearchCriteria } from './account.model';
import { InterfaceAccountInfrastructureService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class AccountInfrastructureService
  implements InterfaceAccountInfrastructureService
{
  private repositoryFactoryHttp$?: BehaviorSubject<symbolSdk.RepositoryFactoryHttp>;
  private accountRepository$?: BehaviorSubject<symbolSdk.AccountRepository>;
  private networkRepository$?: BehaviorSubject<symbolSdk.NetworkRepository>;
  private accountService$?: BehaviorSubject<symbolSdk.AccountService>;
  private accountInfoResolvedMosaic$?: Observable<symbolSdk.AccountInfoResolvedMosaic>;
  private totalChainImportance$?: Observable<string>;
  private account$?: Observable<Account>;

  constructor(private nodeService: NodeService) {
    this.nodeService.nodeUrl$?.subscribe((nodeUrl) => {
      if (this.repositoryFactoryHttp$ instanceof BehaviorSubject) {
        this.repositoryFactoryHttp$.next(
          new symbolSdk.RepositoryFactoryHttp(nodeUrl)
        );
        if (this.accountRepository$ instanceof BehaviorSubject) {
          this.accountRepository$.next(
            this.repositoryFactoryHttp$.getValue().createAccountRepository()
          );
        } else {
          this.accountRepository$ = new BehaviorSubject(
            this.repositoryFactoryHttp$.getValue().createAccountRepository()
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
        if (this.accountService$) {
          this.accountService$.next(
            new symbolSdk.AccountService(this.repositoryFactoryHttp$.getValue())
          );
        } else {
          this.accountService$ = new BehaviorSubject(
            new symbolSdk.AccountService(this.repositoryFactoryHttp$.getValue())
          );
        }
      } else {
        this.repositoryFactoryHttp$ = new BehaviorSubject(
          new symbolSdk.RepositoryFactoryHttp(nodeUrl)
        );
        if (this.accountRepository$ instanceof BehaviorSubject) {
          this.accountRepository$.next(
            this.repositoryFactoryHttp$.getValue().createAccountRepository()
          );
        } else {
          this.accountRepository$ = new BehaviorSubject(
            this.repositoryFactoryHttp$.getValue().createAccountRepository()
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
        if (this.accountService$) {
          this.accountService$.next(
            new symbolSdk.AccountService(this.repositoryFactoryHttp$.getValue())
          );
        } else {
          this.accountService$ = new BehaviorSubject(
            new symbolSdk.AccountService(this.repositoryFactoryHttp$.getValue())
          );
        }
      }
    });
  }

  checkAddressIsValid(address: string): boolean {
    return symbolSdk.Address.isValidRawAddress(address);
  }

  getAccount$(address: string): Observable<Account> | undefined {
    const isValidAddress = this.checkAddressIsValid(address);
    if (!isValidAddress) {
      return of({
        isValid: false,
        address: 'Invalid Address!',
      });
    }
    const symbolAddress = symbolSdk.Address.createFromRawAddress(address);
    if (this.accountService$ instanceof BehaviorSubject) {
      this.accountInfoResolvedMosaic$ = this.accountService$
        .getValue()
        .accountInfoWithResolvedMosaic([symbolAddress])
        .pipe(
          map((accountInfoResolvedMosaics) => accountInfoResolvedMosaics[0])
        );
      if (this.networkRepository$ instanceof BehaviorSubject) {
        this.totalChainImportance$ = this.networkRepository$.pipe(
          mergeMap((networkRepository) => {
            return networkRepository.getNetworkProperties();
          }),
          map((networkConfiguration) => {
            return networkConfiguration.chain.totalChainImportance
              ? networkConfiguration.chain.totalChainImportance.replace(
                  /'/g,
                  ''
                )
              : '0';
          })
        );
        this.account$ = zip(
          this.accountInfoResolvedMosaic$,
          this.totalChainImportance$
        ).pipe(
          map(([accountInfoResolvedMosaic, totalChainImportance]) => {
            return {
              isValid: isValidAddress,
              address: accountInfoResolvedMosaic.address.plain(),
              publicKey: accountInfoResolvedMosaic.publicKey,
              importance: BigInt(
                accountInfoResolvedMosaic.importance.toString()
              ),
              relativeImportance:
                parseInt(accountInfoResolvedMosaic.importance.toString()) /
                parseInt(totalChainImportance),
            };
          })
        );
        return this.account$;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  getAccounts$(
    accountSearchCriteria: AccountSearchCriteria
  ): Observable<Account[]> | undefined {
    if (this.accountRepository$ instanceof BehaviorSubject) {
      return this.accountRepository$.pipe(
        mergeMap((accountRepository) => {
          return accountRepository.search(accountSearchCriteria);
        }),
        map((accounts) => {
          return accounts.data.map((account) => {
            return {
              isValid: true,
              address: account.address.plain(),
              publicKey: account.publicKey.toString(),
            };
          });
        })
      );
    } else {
      return undefined;
    }
  }
}
