import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountInfrastructureService } from './account-infrastructure.service';
import { Account, AccountSearchCriteria } from './account.model';

export interface InterfaceAccountInfrastructureService {
  checkAddressIsValid: (address: string) => boolean;
  getAccount$: (address: string) => Observable<Account>;
  getAccounts$: (
    accountSearchCriteria: AccountSearchCriteria
  ) => Observable<Account[]>;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  account$?: Observable<Account>;

  constructor(
    private accountInfrastructureService: AccountInfrastructureService
  ) {}

  checkAddressIsValid(address: string): boolean {
    return this.accountInfrastructureService.checkAddressIsValid(address);
  }

  getAccount$(address: string): Observable<Account> {
    return this.accountInfrastructureService.getAccount$(address);
  }

  getAccounts$(
    accountSearchCriteria: AccountSearchCriteria
  ): Observable<Account[]> {
    return this.accountInfrastructureService.getAccounts$(
      accountSearchCriteria
    );
  }
}
