import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class ViewTransactionsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('ngOnInit ViewTransactionsComponent');
  }
}
