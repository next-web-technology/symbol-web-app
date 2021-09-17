import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css'],
})
export class ViewExplorerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('ngOnInit ViewExplorerComponent');
  }
}
