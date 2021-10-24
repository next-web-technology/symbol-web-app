import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { WalletService } from 'src/app/model/wallet/wallet.service';
import { importedWallet } from 'src/app/view/wallet/import/import.component';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
})
export class ImportComponent {
  name$: BehaviorSubject<string>;
  address$: BehaviorSubject<string>;
  privateKey$: BehaviorSubject<string>;
  password$: BehaviorSubject<string>;
  isLoading$ = new BehaviorSubject(false);
  isFormDisabled$ = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private walletService: WalletService,
    private snackBar: MatSnackBar
  ) {
    this.name$ = new BehaviorSubject('');
    this.address$ = new BehaviorSubject('');
    this.privateKey$ = new BehaviorSubject('');
    this.password$ = new BehaviorSubject('');
  }

  async appImportWallet(event: importedWallet): Promise<void> {
    this.isLoading$.next(true);
    this.isFormDisabled$.next(true);
    await this.walletService.setWalletWithPrivateKey(
      event.name,
      event.address,
      event.privateKey,
      event.password
    );
    const wallet = await this.walletService.getWallet(event.name);
    if (wallet === undefined || wallet.address !== event.address) {
      console.error('Wallet import failed!');
      this.snackBar.open('Wallet import failed!', undefined, {
        duration: 3000,
      });
    } else {
      this.snackBar.open('Wallet import success', undefined, {
        duration: 3000,
      });
      this.resetForm();
      this.navigateToAccountDetailPage(event.name);
    }
    this.isLoading$.next(false);
    this.isFormDisabled$.next(false);
  }

  resetForm(): void {
    this.name$.next('');
    this.address$.next('');
    this.privateKey$.next('');
    this.password$.next('');
  }

  navigateToAccountDetailPage(walletName: string): void {
    this.router.navigate(['wallet'], {
      queryParams: {
        walletName: walletName,
      },
    });
  }
}
