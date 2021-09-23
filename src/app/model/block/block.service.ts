import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BlockInfrastructureService } from './block-infrastructure.service';
import { Block, Blocks, BlockSearchCriteria } from './block.model';

export interface InterfaceBlockInfrastructureService {
  getBlock$: (height: bigint) => Observable<Block>;
  getLatestBlock$: () => Observable<Block>;
  getBlocks$: (blockSearchCriteria: BlockSearchCriteria) => Observable<Blocks>;
}

@Injectable({
  providedIn: 'root',
})
export class BlockService {
  constructor(private blockInfrastructureService: BlockInfrastructureService) {}

  getBlock$(height: bigint): Observable<Block> {
    return this.blockInfrastructureService.getBlock$(height);
  }

  getLatestBlock$(): Observable<Block> {
    return this.blockInfrastructureService.getLatestBlock$();
  }

  getBlocks$(blockSearchCriteria: BlockSearchCriteria): Observable<Blocks> {
    return this.blockInfrastructureService.getBlocks$(blockSearchCriteria);
  }
}
