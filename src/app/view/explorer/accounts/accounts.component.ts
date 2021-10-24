import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from 'src/app/model/account/account.model';

@Component({
  selector: 'app-view-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class ViewAccountsComponent {
  accountsDisplayedColumns = ['address'];

  @Input() pageSizeOptions?: number[];
  @Input() pageSize$?: BehaviorSubject<number>;
  @Input() pageNumber$?: BehaviorSubject<number>;
  @Input() pageLength$?: Observable<number>;
  @Input() accounts$?: Observable<Account[] | undefined>;

  @Output() moveToAccountDetailPage = new EventEmitter<string>();
  @Output() pagenationChange = new EventEmitter<PageEvent>();

  constructor() {}

  onMoveToAccountDetailPage(address: string): void {
    this.moveToAccountDetailPage.emit(address);
  }

  onPagenationChange(pageEvent: PageEvent): void {
    this.pagenationChange.emit(pageEvent);
  }
}
