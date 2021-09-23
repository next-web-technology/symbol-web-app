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
  private networkRepository$: BehaviorSubject<symbolSdk.NetworkRepository>;
  private chainInfo$?: Observable<symbolSdk.ChainInfo>;
  private pageBlockInfo$?: Observable<symbolSdk.Page<symbolSdk.BlockInfo>>;
  private blockInfo$?: Observable<symbolSdk.BlockInfo>;
  private networkConfiguration$?: Observable<symbolSdk.NetworkConfiguration>;

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
    this.networkRepository$ = new BehaviorSubject(
      this.repositoryFactoryHttp$.getValue().createNetworkRepository()
    );
    this.nodeService.nodeUrl$.subscribe((nodeUrl) => {
      this.repositoryFactoryHttp$.next(
        new symbolSdk.RepositoryFactoryHttp(nodeUrl)
      );
      this.blockRepository$.next(
        this.repositoryFactoryHttp$.getValue().createBlockRepository()
      );
      this.chainRepository$.next(
        this.repositoryFactoryHttp$.getValue().createChainRepository()
      );
      this.networkRepository$.next(
        this.repositoryFactoryHttp$.getValue().createNetworkRepository()
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
    this.networkConfiguration$ = this.networkRepository$.pipe(
      mergeMap((networkRepository) => networkRepository.getNetworkProperties())
    );
    this.blockInfo$ = this.getBlockInfo$(height);
    return combineLatest([this.blockInfo$, this.networkConfiguration$]).pipe(
      map(([blockInfo, networkConfiguration]) => {
        console.log(networkConfiguration);
        console.log(blockInfo);
        const date =
          parseInt(blockInfo.timestamp.toString()) +
          1000 *
            (networkConfiguration.network.epochAdjustment
              ? parseInt(networkConfiguration.network.epochAdjustment)
              : 0);
        const block: Block = {
          height: BigInt(blockInfo.height.toString()),
          hash: blockInfo.hash,
          timestamp: blockInfo.timestamp.toString(),
          date: new Date(date),
          beneficiaryAddress: blockInfo.beneficiaryAddress.plain(),
          signerAddress: blockInfo.signer.address.plain(),
          fee: BigInt(blockInfo.totalFee.toString()),
          transactionsCount: blockInfo.transactionsCount,
          totalTransactionsCount: blockInfo.totalTransactionsCount,
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
