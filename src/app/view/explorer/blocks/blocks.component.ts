import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Blocks } from 'src/app/model/block/block.model';

@Component({
  selector: 'app-view-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class ViewBlocksComponent {
  blocksDisplayedColumns = ['height', 'timestamp', 'hash'];

  @Input() pageSizeOptions?: number[];
  @Input() pageSize$?: Observable<number>;
  @Input() pageNumber$?: Observable<number>;
  @Input() pageLength$?: Observable<number>;
  @Input() order$?: Observable<string>;
  @Input() orderBy$?: Observable<string>;
  @Input() blocks$?: Observable<Blocks | undefined>;

  @Output() moveToBlockDetailPage = new EventEmitter<bigint>();
  @Output() blocksPagenationChange = new EventEmitter<PageEvent>();

  constructor(private readonly snackBar: MatSnackBar) {}

  onMoveToBlockDetailPage(height: string): void {
    if (BigInt(height) !== BigInt(0)) {
      this.moveToBlockDetailPage.emit(BigInt(height));
    } else {
      this.snackBar.open('Block Height 0 does not exist!', undefined, {
        duration: 3000,
      });
    }
  }

  onPagenationChange(pageEvent: PageEvent): void {
    this.blocksPagenationChange.emit(pageEvent);
  }
}
