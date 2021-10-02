import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Account } from 'src/app/model/account/account.model';
import { AccountService } from 'src/app/model/account/account.service';
import { Mosaic } from 'src/app/model/mosaic/mosaic.model';
import { MosaicService } from 'src/app/model/mosaic/mosaic.service';
import { Wallet } from 'src/app/model/wallet/wallet.model';
import { WalletService } from 'src/app/model/wallet/wallet.service';
import {
  Transaction,
  TransactionAnnounceResponse,
} from 'src/app/model/transaction/transaction.model';
import { TransactionService } from 'src/app/model/transaction/transaction.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements OnInit {
  wallets$?: BehaviorSubject<Wallet[]>;
  selectedWalletName$?: BehaviorSubject<string>;
  selectedWallet$?: BehaviorSubject<Wallet>;
  account$?: Observable<Account>;
  mosaics$?: Observable<Mosaic[]>;
  transactionHash$?: Observable<string>;
  address$?: BehaviorSubject<string>;
  relativeAmount$?: BehaviorSubject<number>;
  message$?: BehaviorSubject<string>;
  isLoading$ = new BehaviorSubject(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private walletService: WalletService,
    private accountService: AccountService,
    private mosaicService: MosaicService,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar
  ) {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams.walletName) {
        console.log(queryParams.walletName);
        this.selectedWalletName$ = new BehaviorSubject(queryParams.walletName);
      }
      if (queryParams.address) {
        this.address$ = new BehaviorSubject(queryParams.address);
      }
      if (queryParams.relativeAmount) {
        this.relativeAmount$ = new BehaviorSubject(queryParams.relativeAmount);
      }
      if (queryParams.message) {
        this.message$ = new BehaviorSubject(queryParams.message);
      }
    });
    this.walletService.getWallets().then((wallets) => {
      if (wallets === undefined || wallets.length === 0) {
        this.router.navigate(['/wallet/import']);
      } else {
        this.wallets$ = new BehaviorSubject(wallets);
        if (this.selectedWalletName$ !== undefined) {
          this.selectedWalletName$.subscribe((selectedWalletName) => {
            console.log(selectedWalletName);
            this.walletService.getWallet(selectedWalletName).then((wallet) => {
              if (wallet) {
                if (this.selectedWallet$) {
                  this.selectedWallet$?.next(wallet);
                } else {
                  this.selectedWallet$ = new BehaviorSubject(wallet);
                }
                this.account$ = this.selectedWallet$.pipe(
                  mergeMap((selectedWallet) => {
                    return this.accountService.getAccount$(
                      selectedWallet.address
                    );
                  })
                );
                this.mosaics$ = this.selectedWallet$.pipe(
                  mergeMap((selectedWallet) => {
                    return this.mosaicService.getMosaicsFromAddress$(
                      selectedWallet.address
                    );
                  })
                );
              }
            });
          });
        } else if (this.selectedWallet$ === undefined) {
          this.selectedWallet$ = new BehaviorSubject(wallets[0]);
          this.account$ = this.selectedWallet$.pipe(
            mergeMap((selectedWallet) => {
              return this.accountService.getAccount$(selectedWallet.address);
            })
          );
          this.mosaics$ = this.selectedWallet$.pipe(
            mergeMap((selectedWallet) => {
              return this.mosaicService.getMosaicsFromAddress$(
                selectedWallet.address
              );
            })
          );
          this.selectedWalletName$ = new BehaviorSubject(wallets[0].name);
          this.selectedWalletName$.subscribe((selectedWalletName) => {
            console.log(selectedWalletName);
            this.walletService.getWallet(selectedWalletName).then((wallet) => {
              if (wallet) {
                this.selectedWallet$?.next(wallet);
              }
            });
          });
        }
      }
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit WalletComponent');
  }

  appSelectedWalletChange($event: string): void {
    this.selectedWalletName$?.next($event);
  }

  appSendTransaction(transaction: Transaction): void {
    console.log('appSendTransaction');
    this.isLoading$.next(true);
    this.transactionService.sendTransaction$(transaction).subscribe(
      (transactionAnnounceResponse) => {
        console.log(transactionAnnounceResponse);
        if (transactionAnnounceResponse.hash) {
          this.snackBar.open('Transaction has been announced.', undefined, {
            duration: 5000,
          });
          this.monitorTransaction(transactionAnnounceResponse);
        }
      },
      (error) => {
        console.error(error);
        this.isLoading$.next(false);
        this.snackBar.open('Transaction Announce Error!', undefined, {
          duration: 5000,
        });
      }
    );
  }

  monitorTransaction(
    transactionAnnounceResponse: TransactionAnnounceResponse
  ): void {
    const hash = transactionAnnounceResponse.hash;
    if (hash !== undefined) {
      const subscription = this.transactionService
        .monitorTransaction$(hash)
        .subscribe(
          (transactionMonitorResponse) => {
            console.log(
              'transactionMonitorResponse',
              transactionMonitorResponse
            );
            if (transactionMonitorResponse.status === 'Not Found') {
              this.snackBar.open(
                'Waiting for Transaction Confirmed...',
                undefined,
                {
                  duration: 5000,
                }
              );
              console.log('Transaction is not found!');
            }
            if (transactionMonitorResponse.status === 'Unconfirmed') {
              this.snackBar.open(
                'Waiting for Transaction Confirmed...',
                undefined,
                {
                  duration: 5000,
                }
              );
              console.log('Transaction is unconfirmed!');
            }
            if (transactionMonitorResponse.status === 'Confirmed') {
              console.log('Transaction is confirmed!');
              this.isLoading$.next(false);
              this.snackBar.open('Transaction has been confirmed!', undefined, {
                duration: 5000,
              });
              subscription.unsubscribe();
            }
          },
          (error) => {
            console.error(error);
            this.isLoading$.next(false);
            this.snackBar.open('Transaction Monitoring Error!', undefined, {
              duration: 5000,
            });
          },
          () => {
            console.log('completed');
          }
        );
    }
  }

  appMoveToWalletImportPage(): void {
    this.router.navigate(['/wallet/import']);
  }
}
