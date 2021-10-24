import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BlockInfrastructureService } from './block-infrastructure.service';
import { Block, Blocks, BlockSearchCriteria } from './block.model';

export interface InterfaceBlockInfrastructureService {
  getBlock$: (height: bigint) => Observable<Block> | undefined;
  getLatestBlock$: () => Observable<Block> | undefined;
  getBlocks$: (
    blockSearchCriteria: BlockSearchCriteria
  ) => Observable<Blocks> | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class BlockService {
  constructor(private blockInfrastructureService: BlockInfrastructureService) {}

  getBlock$(height: bigint): Observable<Block> | undefined {
    return this.blockInfrastructureService.getBlock$(height);
  }

  getLatestBlock$(): Observable<Block | undefined> | undefined {
    return this.blockInfrastructureService.getLatestBlock$();
  }

  getBlocks$(
    blockSearchCriteria: BlockSearchCriteria
  ): Observable<Blocks> | undefined {
    return this.blockInfrastructureService.getBlocks$(blockSearchCriteria);
  }
}
