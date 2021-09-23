import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css'],
})
export class ViewBlockComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('ngOnInit ViewBlockComponent');
  }
}
