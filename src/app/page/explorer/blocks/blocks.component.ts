import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Blocks, BlockSearchCriteria } from 'src/app/model/block/block.model';
import { BlockService } from 'src/app/model/block/block.service';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class BlocksComponent implements OnInit {
  pageSizeOptions = [10, 20, 50, 100];
  pageSize$: BehaviorSubject<number> = new BehaviorSubject(10);
  pageNumber$: BehaviorSubject<number> = new BehaviorSubject(1);
  pageLength$: BehaviorSubject<number> = new BehaviorSubject(1000);
  order$: BehaviorSubject<string> = new BehaviorSubject('descending');
  orderBy$: BehaviorSubject<string> = new BehaviorSubject('height');
  blockSearchCriteria$: BehaviorSubject<BlockSearchCriteria> =
    new BehaviorSubject({
      pageSize: 10,
      pageNumber: 1,
      order: 'descending',
      orderBy: 'height',
    } as BlockSearchCriteria);
  blocks$: Observable<Blocks>;

  constructor(
    private route: ActivatedRoute,
    private blockService: BlockService
  ) {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams.pageSize) {
        this.pageSize$.next(queryParams.pageSize);
      }
      if (queryParams.pageNumber) {
        this.pageNumber$.next(queryParams.pageNumber);
      }
      if (queryParams.order) {
        this.order$.next(queryParams.order);
      }
      if (queryParams.orderBy) {
        this.orderBy$.next(queryParams.orderBy);
      }
    });
    combineLatest([
      this.pageSize$,
      this.pageNumber$,
      this.order$,
      this.orderBy$,
    ]).subscribe(([pageSize, pageNumber, order, orderBy]) => {
      const blockSearchCriteria: BlockSearchCriteria = {
        pageSize,
        pageNumber,
        order,
        orderBy,
      };
      this.blockSearchCriteria$.next(blockSearchCriteria);
    });
    this.blocks$ = this.blockSearchCriteria$.pipe(
      mergeMap((blockSearchCriteria) => {
        return this.blockService.getBlocks$(blockSearchCriteria);
      })
    );
  }

  ngOnInit(): void {
    console.log('ngOnInit BlocksComponent');
    this.blocks$.subscribe((blocks) => console.log(blocks));
  }
}
