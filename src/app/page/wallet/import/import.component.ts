import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { WalletService } from 'src/app/model/wallet/wallet.service';
import { importedWallet } from 'src/app/view/wallet/import/import.component';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
})
export class ImportComponent implements OnInit {
  name$: BehaviorSubject<string>;
  address$: BehaviorSubject<string>;
  privateKey$: BehaviorSubject<string>;
  password$: BehaviorSubject<string>;
  isLoading$ = new BehaviorSubject(false);
  isFormDisabled$ = new BehaviorSubject(false);

  constructor(private router: Router, private walletService: WalletService) {
    this.name$ = new BehaviorSubject('');
    this.address$ = new BehaviorSubject('');
    this.privateKey$ = new BehaviorSubject('');
    this.password$ = new BehaviorSubject('');
  }

  ngOnInit(): void {
    console.log('ngOnInit ImportComponent');
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
    console.log('Wallet import try');
    const wallet = await this.walletService.getWallet(event.name);
    if (wallet === undefined || wallet.address !== event.address) {
      console.error('Wallet import failed!');
    } else {
      console.log('Wallet import success');
      this.resetForm();
      this.navigateToAccountDetailPage(event.address);
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

  navigateToAccountDetailPage(address: string): void {
    this.router.navigate([`/explorer/accounts/${address}`]);
  }
}
