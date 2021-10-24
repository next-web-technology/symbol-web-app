import { Injectable } from '@angular/core';
import { NodeService } from '../node/node.service';
import * as symbolSdk from 'symbol-sdk';
import { BehaviorSubject, combineLatest, Observable, of, timer } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  Transaction,
  TransactionAnnounceResponse,
  TransactionMonitorResponse,
} from './transaction.model';
import { InterfaceTransactionInfrastructureService } from './transaction.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionInfrastructureService
  implements InterfaceTransactionInfrastructureService
{
  private repositoryFactoryHttp$?: BehaviorSubject<symbolSdk.RepositoryFactoryHttp>;
  private networkRepository$?: BehaviorSubject<symbolSdk.NetworkRepository>;
  private transactionRepository$?: BehaviorSubject<symbolSdk.TransactionRepository>;
  private receiptRepository$?: BehaviorSubject<symbolSdk.ReceiptRepository>;
  private epochAdjustment$?: Observable<number>;
  private networkType$?: Observable<symbolSdk.NetworkType>;
  private generationHash$?: Observable<string>;
  private networkCurrencies$?: Observable<symbolSdk.NetworkCurrencies>;
  private medianFeeMultiPlier$?: Observable<number>;
  private transactionMonitorResponse$?: BehaviorSubject<TransactionMonitorResponse>;

  constructor(private nodeService: NodeService) {
    this.nodeService.nodeUrl$?.subscribe((nodeUrl) => {
      if (this.repositoryFactoryHttp$ instanceof BehaviorSubject) {
        this.repositoryFactoryHttp$.next(
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
      if (this.transactionRepository$ instanceof BehaviorSubject) {
        this.transactionRepository$.next(
          this.repositoryFactoryHttp$.getValue().createTransactionRepository()
        );
      } else {
        this.transactionRepository$ = new BehaviorSubject(
          this.repositoryFactoryHttp$.getValue().createTransactionRepository()
        );
      }
      this.epochAdjustment$ = this.repositoryFactoryHttp$.pipe(
        mergeMap((repositoryFactoryHttp) =>
          repositoryFactoryHttp.getEpochAdjustment()
        )
      );
      this.networkType$ = this.repositoryFactoryHttp$.pipe(
        mergeMap((repositoryFactoryHttp) =>
          repositoryFactoryHttp.getNetworkType()
        )
      );
      this.generationHash$ = this.repositoryFactoryHttp$.pipe(
        mergeMap((repositoryFactoryHttp) =>
          repositoryFactoryHttp.getGenerationHash()
        )
      );
      this.networkCurrencies$ = this.repositoryFactoryHttp$.pipe(
        mergeMap((repositoryFactoryHttp) =>
          repositoryFactoryHttp.getCurrencies()
        )
      );
      this.medianFeeMultiPlier$ = this.networkRepository$.pipe(
        mergeMap((networkRepository) => networkRepository.getTransactionFees()),
        map((transactionFees) => transactionFees.medianFeeMultiplier)
      );
    });
  }

  sendTransaction$(
    transaction: Transaction
  ): Observable<TransactionAnnounceResponse> | undefined {
    let count = 0;
    const recipientAddress = symbolSdk.Address.createFromRawAddress(
      transaction.address
    );
    const walletName = transaction.wallet.name;
    const walletAddress = symbolSdk.Address.createFromRawAddress(
      transaction.wallet.address
    );
    const walletEncryptedWallet = transaction.wallet.encryptedPrivateKey;
    const wallet = new symbolSdk.SimpleWallet(
      walletName,
      walletAddress,
      walletEncryptedWallet
    );
    const account = wallet.open(new symbolSdk.Password(transaction.password));
    if (
      this.epochAdjustment$ === undefined ||
      this.generationHash$ === undefined ||
      this.networkCurrencies$ === undefined ||
      this.networkType$ === undefined ||
      this.medianFeeMultiPlier$ === undefined ||
      this.transactionRepository$ == undefined
    ) {
      return undefined;
    }
    const combinedLatest = combineLatest([
      this.epochAdjustment$,
      this.generationHash$,
      this.networkCurrencies$,
      this.networkType$,
      this.medianFeeMultiPlier$,
      this.transactionRepository$,
    ]);
    return combinedLatest.pipe(
      mergeMap(
        ([
          epochAdjustment,
          generationHash,
          networkCurrencies,
          networkType,
          medianFeeMultiplier,
          transactionRepository,
        ]) => {
          if (count > 0) {
            throw Error('Transaction Announce has already completed!');
          }
          const transferTransaction = symbolSdk.TransferTransaction.create(
            symbolSdk.Deadline.create(epochAdjustment),
            recipientAddress,
            [
              networkCurrencies.currency.createRelative(
                transaction.relativeAmount
              ),
            ],
            symbolSdk.PlainMessage.create(transaction.message),
            networkType
          ).setMaxFee(medianFeeMultiplier);
          const signedTransaction = account.sign(
            transferTransaction,
            generationHash
          );
          console.log('Payload', signedTransaction.payload);
          console.log('Transaction Hash', signedTransaction.hash);
          count = count + 1;
          return transactionRepository.announce(signedTransaction).pipe(
            map((transactionAnnounceResponse) => {
              return {
                message: transactionAnnounceResponse.message,
                hash: signedTransaction.hash,
              };
            })
          );
        }
      )
    );
  }

  monitorTransaction$(
    hash: string
  ): Observable<TransactionMonitorResponse> | undefined {
    const pollingIntervalSeconds = 5;
    const pollingLimitHours = 2;
    const pollingCountLimit = Math.round(
      (pollingLimitHours * 60 * 60) / pollingIntervalSeconds
    );
    let count = 0;
    this.transactionMonitorResponse$ = new BehaviorSubject({
      hash,
      status: 'Not Found',
    } as TransactionMonitorResponse);
    const timer$ = timer(0, 5 * 1000);
    if (this.transactionRepository$ === undefined) {
      return undefined;
    }
    const unconfirmedTransaction$ = combineLatest([
      timer$,
      this.transactionRepository$,
    ]).pipe(
      mergeMap(([timer, transactionRepository]) => {
        console.log('Timer of unconfirmedTransactionMonitor', timer);
        try {
          return transactionRepository
            .getTransaction(hash, symbolSdk.TransactionGroup.Unconfirmed)
            .pipe(
              map((transaction) => transaction),
              catchError((error) => {
                console.log(error);
                return of('Not Found');
              })
            );
        } catch (error) {
          console.log(error);
          return of('Not Found');
        }
      }),
      catchError((error) => {
        console.log(error);
        return of('Not Found');
      })
    );
    const confirmedTransaction$ = combineLatest([
      timer$,
      this.transactionRepository$,
    ]).pipe(
      mergeMap(([timer, transactionRepository]) => {
        console.log('Timer of confirmedTransactionMonitor', timer);
        try {
          return transactionRepository
            .getTransaction(hash, symbolSdk.TransactionGroup.Confirmed)
            .pipe(
              map((transaction) => transaction),
              catchError((error) => {
                console.log(error);
                return of('Not Found');
              })
            );
        } catch (error) {
          console.log(error);
          return of('Not Found');
        }
      }),
      catchError((error) => {
        console.log(error);
        return of('Not Found');
      })
    );
    const subscription = combineLatest([
      unconfirmedTransaction$,
      confirmedTransaction$,
    ]).subscribe(([unconfirmedTransaction, confirmedTransaction]) => {
      if (count >= pollingCountLimit) {
        console.error('Transaction has expired!');
        subscription.unsubscribe();
      }
      console.log('responses', unconfirmedTransaction, confirmedTransaction);
      if (confirmedTransaction !== 'Not Found') {
        this.transactionMonitorResponse$?.next({
          hash,
          status: 'Confirmed',
        } as TransactionMonitorResponse);
        subscription.unsubscribe();
      }
      if (unconfirmedTransaction !== 'Not Found') {
        this.transactionMonitorResponse$?.next({
          hash,
          status: 'Unconfirmed',
        } as TransactionMonitorResponse);
      }
      count++;
    });
    return this.transactionMonitorResponse$.asObservable();
  }
}
