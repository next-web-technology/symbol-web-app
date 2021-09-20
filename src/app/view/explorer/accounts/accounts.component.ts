import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Account } from 'src/app/model/account/account.model';

@Component({
  selector: 'app-view-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class ViewAccountsComponent implements OnInit {
  accountsDisplayedColumns = ['address'];

  @Input() pageSizeOptions?: number[];
  @Input() pageSize$?: BehaviorSubject<number>;
  @Input() pageNumber$?: BehaviorSubject<number>;
  @Input() pageLength$?: Observable<number>;
  @Input() accounts$?: Observable<Account[]>;

  @Output() moveToAccountDetailPage = new EventEmitter<string>();
  @Output() pagenationChange = new EventEmitter<PageEvent>();

  constructor() {}

  ngOnInit(): void {
    console.log('ngOnInit ViewAccountsComponent');
  }

  onMoveToAccountDetailPage(address: string): void {
    this.moveToAccountDetailPage.emit(address);
  }

  onPagenationChange(pageEvent: PageEvent): void {
    this.pagenationChange.emit(pageEvent);
  }
}
