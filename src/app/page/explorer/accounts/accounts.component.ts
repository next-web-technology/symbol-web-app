import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
  Account,
  AccountSearchCriteria,
} from 'src/app/model/account/account.model';
import { AccountService } from 'src/app/model/account/account.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent {
  pageSizeOptions = [10, 20, 50, 100];
  pageSize$: BehaviorSubject<number> = new BehaviorSubject(10);
  pageNumber$: BehaviorSubject<number> = new BehaviorSubject(1);
  accountSearchCriteria$: BehaviorSubject<AccountSearchCriteria> =
    new BehaviorSubject({
      pageSize: 10,
      pageNumber: 1,
    });
  pageLength$: BehaviorSubject<number> = new BehaviorSubject(1000);
  accounts$: Observable<Account[] | undefined>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams.pageSize) {
        this.pageSize$.next(queryParams.pageSize);
      }
      if (queryParams.pageNumber) {
        this.pageNumber$.next(queryParams.pageNumber);
      }
    });
    combineLatest([this.pageSize$, this.pageNumber$]).subscribe(
      ([pageSize, pageNumber]) => {
        const accountSearchCriteria: AccountSearchCriteria = {
          pageSize,
          pageNumber,
        };
        this.accountSearchCriteria$.next(accountSearchCriteria);
      }
    );
    this.accounts$ = this.accountSearchCriteria$.pipe(
      mergeMap((accountSearchCriteria) => {
        const accounts$ = this.accountService.getAccounts$(
          accountSearchCriteria
        );
        if (accounts$ === undefined) {
          return of(undefined);
        }
        return accounts$;
      })
    );
  }

  appMoveToAccountDetailPage(address: string): void {
    if (this.accountService.checkAddressIsValid(address)) {
      this.router.navigate([`/explorer/accounts/${address}`]);
    } else {
      this.snackBar.open('Invalid Address!', undefined, {
        duration: 3000,
      });
    }
  }

  appPagenationChanged(pageEvent: PageEvent): void {
    this.pageSize$.next(pageEvent.pageSize);
    this.pageNumber$.next(pageEvent.pageIndex + 1);
    this.pageLength$.next(pageEvent.length);
  }
}
