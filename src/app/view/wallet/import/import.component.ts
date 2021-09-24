import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
})
export class ViewImportComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('ngOnInit ViewImportComponent');
  }
}
