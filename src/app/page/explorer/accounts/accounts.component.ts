import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent implements OnInit {
  pageSize$: BehaviorSubject<number> = new BehaviorSubject(10);
  pageNumber$: BehaviorSubject<number> = new BehaviorSubject(1);
  order$: BehaviorSubject<string> = new BehaviorSubject('desc');
  orderBy$: BehaviorSubject<string> = new BehaviorSubject('balance');
  // xembook.tomato
  mosaicId$: BehaviorSubject<string> = new BehaviorSubject('310378C18A140D1B');

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams.pageSize) {
        this.pageSize$.next(queryParams.pageSize);
      }
      if (queryParams.pageNumber) {
        this.pageNumber$.next(queryParams.pageNumber);
      }
      if (queryParams.order) {
        this.order$.next(queryParams.order);
      }
      if (queryParams.orderBy) {
        this.orderBy$.next(queryParams.orderBy);
      }
      if (queryParams.mosaicId) {
        this.mosaicId$.next(queryParams.mosaicId);
      }
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit AccountsComponent');
  }
}
