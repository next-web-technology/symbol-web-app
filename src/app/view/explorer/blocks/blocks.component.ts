import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class ViewBlocksComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('ngOnInit ViewBlocksComponent');
  }
}
