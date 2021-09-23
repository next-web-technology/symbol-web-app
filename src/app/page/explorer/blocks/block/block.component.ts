import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Block } from 'src/app/model/block/block.model';
import { BlockService } from 'src/app/model/block/block.service';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css'],
})
export class BlockComponent implements OnInit {
  height$?: Observable<bigint>;
  block$?: Observable<Block>;

  constructor(
    private route: ActivatedRoute,
    private blockService: BlockService
  ) {
    this.height$ = this.route.params.pipe(map((params) => params.height));
    this.block$ = this.height$?.pipe(
      mergeMap((height) => {
        return this.blockService.getBlock$(height);
      })
    );
  }

  ngOnInit(): void {
    console.log('ngOnInit BlockComponent');
    this.block$?.subscribe((block) => console.log(block));
  }
}
