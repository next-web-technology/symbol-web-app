import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Block } from 'src/app/model/block/block.model';

@Component({
  selector: 'app-view-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css'],
})
export class ViewBlockComponent implements OnInit {
  @Input() block$?: Observable<Block>;

  constructor() {}

  ngOnInit(): void {
    console.log('ngOnInit ViewBlockComponent');
  }
}
