import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from 'src/app/model/account/account.model';
import { Mosaic } from 'src/app/model/mosaic/mosaic.model';
import { Wallet } from 'src/app/model/wallet/wallet.model';
import { TransferXYMWithPlainMessageTransaction } from 'src/app/model/transaction/transaction.model';

@Component({
  selector: 'app-view-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class ViewWalletComponent {
  mosaicsDisplayedColumns: string[] = ['icon', 'relativeAmount', 'name', 'id'];
  isPasswordVisible = false;

  @Input() wallets?: Wallet[] | null;
  @Input() selectedWalletName?: string | null;
  @Input() selectedWallet?: Wallet | null;
  @Input() account?: Account | null;
  @Input() mosaics?: Mosaic[] | null;
  @Input() address?: string | null;
  @Input() relativeAmount?: number | null;
  @Input() message?: string | null;
  @Input() isLoading?: boolean | null;

  @Output() selectedWalletChange = new EventEmitter<string>();
  @Output() sendTransaction =
    new EventEmitter<TransferXYMWithPlainMessageTransaction>();
  @Output() moveToWalletImportPage = new EventEmitter();

  constructor() {}

  onSelectedWalletChange($event: string): void {
    this.selectedWalletChange.emit($event);
  }

  onTogglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSendTransaction(
    selectedWalletName: string,
    address: string,
    relativeAmount: string,
    message: string,
    password: string
  ): void {
    const wallet = this.wallets?.filter(
      (wallet) => wallet.name === selectedWalletName
    )[0];
    if (wallet === undefined) {
      throw Error('Selected Wallet Name does not exist!');
    }
    if (this.mosaics === undefined) {
      throw Error('Selected Wallet has no balances!');
    } else if (this.mosaics?.length === 0) {
      throw Error('Selected Wallet has no balances!');
    }
    const walletRelativeAmount = this.mosaics
      ?.filter((mosaic) => mosaic.name === 'symbol.xym')
      .map((mosaic) => mosaic.relativeAmount)[0];
    if (
      (walletRelativeAmount ? walletRelativeAmount : 0) -
        parseFloat(relativeAmount) <
      0
    ) {
      throw Error('Insufficient Balances!');
    }
    const transactionOriginalData: TransferXYMWithPlainMessageTransaction = {
      wallet,
      mosaics: this.mosaics ? this.mosaics : [],
      address,
      relativeAmount: parseFloat(relativeAmount),
      message,
      password,
    };
    this.sendTransaction.emit(transactionOriginalData);
  }

  onMoveToWalletImportPage(): void {
    this.moveToWalletImportPage.emit();
  }
}
