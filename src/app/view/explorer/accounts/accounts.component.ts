import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class ViewAccountsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('ngOnInit ViewAccountsComponent');
  }
}
