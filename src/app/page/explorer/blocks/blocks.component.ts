import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
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
  blocks$: Observable<Blocks | undefined>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
        const blocks$ = this.blockService.getBlocks$(blockSearchCriteria);
        if (blocks$ === undefined) {
          return of(undefined);
        }
        return blocks$;
      })
    );
  }

  ngOnInit(): void {
    this.blocks$.subscribe((blocks) => {
      if (blocks === undefined) {
        return;
      }
      this.pageLength$.next(parseInt(blocks.latestBlockHeight.toString()));
    });
  }

  appMoveToBlockDetailPage(height: bigint): void {
    this.router.navigate([`/explorer/blocks/${height}`]);
  }

  appPagenationChange(pageEvent: PageEvent): void {
    this.pageSize$.next(pageEvent.pageSize);
    this.pageNumber$.next(pageEvent.pageIndex + 1);
    this.pageLength$.next(pageEvent.length);
  }
}
