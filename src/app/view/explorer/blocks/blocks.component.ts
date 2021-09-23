import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { Blocks } from 'src/app/model/block/block.model';

@Component({
  selector: 'app-view-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class ViewBlocksComponent implements OnInit {
  blocksDisplayedColumns = ['height', 'timestamp', 'hash'];

  @Input() pageSizeOptions?: number[];
  @Input() pageSize$?: Observable<number>;
  @Input() pageNumber$?: Observable<number>;
  @Input() pageLength$?: Observable<number>;
  @Input() order$?: Observable<string>;
  @Input() orderBy$?: Observable<string>;
  @Input() blocks$?: Observable<Blocks>;

  @Output() blocksPagenationChange = new EventEmitter<PageEvent>();

  constructor() {}

  ngOnInit(): void {
    console.log('ngOnInit ViewBlocksComponent');
  }

  onPagenationChange(pageEvent: PageEvent): void {
    this.blocksPagenationChange.emit(pageEvent);
  }
}
