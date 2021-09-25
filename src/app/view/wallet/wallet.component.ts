import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class ViewWalletComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('ngOnInit ViewWalletComponent');
  }
}
