import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Block } from 'src/app/model/block/block.model';

@Component({
  selector: 'app-view-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css'],
})
export class ViewBlockComponent {
  @Input() block$?: Observable<Block | undefined>;

  constructor() {}
}
