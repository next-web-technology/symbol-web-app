import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Block } from 'src/app/model/block/block.model';
import { BlockService } from 'src/app/model/block/block.service';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css'],
})
export class BlockComponent {
  height$?: Observable<bigint>;
  block$?: Observable<Block | undefined>;

  constructor(
    private route: ActivatedRoute,
    private blockService: BlockService
  ) {
    this.height$ = this.route.params.pipe(map((params) => params.height));
    this.block$ = this.height$?.pipe(
      mergeMap((height) => {
        const blocks$ = this.blockService.getBlock$(height);
        if (blocks$ === undefined) {
          return of(undefined);
        }
        return blocks$;
      })
    );
  }
}
