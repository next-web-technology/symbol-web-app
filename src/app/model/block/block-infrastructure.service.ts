import { Injectable } from '@angular/core';
import { NodeService } from '../node/node.service';
import * as symbolSdk from 'symbol-sdk';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Block, Blocks, BlockSearchCriteria } from './block.model';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BlockInfrastructureService {
  private repositoryFactoryHttp$: BehaviorSubject<symbolSdk.RepositoryFactoryHttp>;
  private blockRepository$: BehaviorSubject<symbolSdk.BlockRepository>;
  private chainRepository$: BehaviorSubject<symbolSdk.ChainRepository>;
  private chainInfo$?: Observable<symbolSdk.ChainInfo>;
  private pageBlockInfo$?: Observable<symbolSdk.Page<symbolSdk.BlockInfo>>;
  private blockInfo$?: Observable<symbolSdk.BlockInfo>;

  constructor(private nodeService: NodeService) {
    this.repositoryFactoryHttp$ = new BehaviorSubject(
      new symbolSdk.RepositoryFactoryHttp(this.nodeService.nodeUrl$.getValue())
    );
    this.blockRepository$ = new BehaviorSubject(
      this.repositoryFactoryHttp$.getValue().createBlockRepository()
    );
    this.chainRepository$ = new BehaviorSubject(
      this.repositoryFactoryHttp$.getValue().createChainRepository()
    );
    this.nodeService.nodeUrl$.subscribe((nodeUrl) => {
      this.repositoryFactoryHttp$.next(
        new symbolSdk.RepositoryFactoryHttp(
          this.nodeService.nodeUrl$.getValue()
        )
      );
      this.blockRepository$.next(
        this.repositoryFactoryHttp$.getValue().createBlockRepository()
      );
      this.chainRepository$ = new BehaviorSubject(
        this.repositoryFactoryHttp$.getValue().createChainRepository()
      );
    });
  }

  convertBlockSearchCriteria(
    blockSearchCriteria: BlockSearchCriteria
  ): symbolSdk.BlockSearchCriteria {
    return {
      signerPublicKey: blockSearchCriteria.signerPublicKey,
      beneficiaryAddress: blockSearchCriteria.beneficiaryAddress,
      pageSize: blockSearchCriteria.pageSize
        ? blockSearchCriteria.pageSize
        : 10,
      pageNumber: blockSearchCriteria.pageNumber
        ? blockSearchCriteria.pageNumber
        : 1,
      order:
        blockSearchCriteria.order === undefined
          ? symbolSdk.Order.Asc
          : blockSearchCriteria.order === 'descending'
          ? symbolSdk.Order.Desc
          : symbolSdk.Order.Asc,
      orderBy:
        blockSearchCriteria.orderBy === undefined
          ? symbolSdk.BlockOrderBy.Id
          : blockSearchCriteria.orderBy === 'height'
          ? symbolSdk.BlockOrderBy.Height
          : symbolSdk.BlockOrderBy.Id,
    };
  }

  getChainInfo$(): Observable<symbolSdk.ChainInfo> {
    return this.chainRepository$.pipe(
      mergeMap((chainRepository) => chainRepository.getChainInfo())
    );
  }

  getPageBlockInfo$(
    blockSearchCriteria: BlockSearchCriteria
  ): Observable<symbolSdk.Page<symbolSdk.BlockInfo>> {
    return this.blockRepository$.pipe(
      mergeMap((blockRepository) =>
        blockRepository.search(
          this.convertBlockSearchCriteria(blockSearchCriteria)
        )
      )
    );
  }

  getBlockInfo$(height: bigint): Observable<symbolSdk.BlockInfo> {
    return this.blockRepository$.pipe(
      mergeMap((blockRepository) =>
        blockRepository.getBlockByHeight(
          symbolSdk.UInt64.fromUint(parseInt(height.toString()))
        )
      )
    );
  }

  getBlock$(height: bigint): Observable<Block> {
    this.blockInfo$ = this.getBlockInfo$(height);
    return this.blockInfo$.pipe(
      map((blockInfo) => {
        const block: Block = {
          height: BigInt(blockInfo.height.toString()),
          hash: blockInfo.hash,
          timestamp: blockInfo.timestamp.toString(),
        };
        return block;
      })
    );
  }

  getLatestBlock$(): Observable<Block> {
    this.chainInfo$ = this.getChainInfo$();
    return this.chainInfo$.pipe(
      mergeMap((chainInfo) => {
        return this.getBlock$(BigInt(chainInfo.height.toString()));
      })
    );
  }

  getBlocks$(blockSearchCriteria: BlockSearchCriteria): Observable<Blocks> {
    this.chainInfo$ = this.getChainInfo$();
    this.pageBlockInfo$ = this.getPageBlockInfo$(blockSearchCriteria);
    return combineLatest([this.chainInfo$, this.pageBlockInfo$]).pipe(
      map(([chainInfo, pageBlockInfo]) => {
        const blocks: Blocks = {
          data: pageBlockInfo.data.map((block) => {
            return {
              height: BigInt(block.height.toString()),
              hash: block.hash.toString(),
              timestamp: block.timestamp.toString(),
            };
          }),
          latestFinalizedBlockHeight: BigInt(
            chainInfo.latestFinalizedBlock.height.toString()
          ),
          latestBlockHeight: BigInt(chainInfo.height.toString()),
          pageSize: pageBlockInfo.pageSize,
          pageNumber: pageBlockInfo.pageNumber,
        };
        return blocks;
      })
    );
  }
}
