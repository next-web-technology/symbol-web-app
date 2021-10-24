import { Injectable } from '@angular/core';
import { NodeService } from '../node/node.service';
import * as symbolSdk from 'symbol-sdk';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { Block, Blocks, BlockSearchCriteria } from './block.model';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BlockInfrastructureService {
  private repositoryFactoryHttp$?: BehaviorSubject<symbolSdk.RepositoryFactoryHttp>;
  private blockRepository$?: BehaviorSubject<symbolSdk.BlockRepository>;
  private chainRepository$?: BehaviorSubject<symbolSdk.ChainRepository>;
  private networkRepository$?: BehaviorSubject<symbolSdk.NetworkRepository>;
  private chainInfo$?: Observable<symbolSdk.ChainInfo>;
  private pageBlockInfo$?: Observable<symbolSdk.Page<symbolSdk.BlockInfo>>;
  private blockInfo$?: Observable<symbolSdk.BlockInfo>;
  private networkConfiguration$?: Observable<symbolSdk.NetworkConfiguration>;

  constructor(private nodeService: NodeService) {
    this.nodeService.nodeUrl$?.subscribe((nodeUrl) => {
      if (this.repositoryFactoryHttp$ instanceof BehaviorSubject) {
        this.repositoryFactoryHttp$.next(
          new symbolSdk.RepositoryFactoryHttp(nodeUrl)
        );
      } else {
        this.repositoryFactoryHttp$ = new BehaviorSubject(
          new symbolSdk.RepositoryFactoryHttp(nodeUrl)
        );
      }
      if (this.blockRepository$ instanceof BehaviorSubject) {
        this.blockRepository$.next(
          this.repositoryFactoryHttp$.getValue().createBlockRepository()
        );
      } else {
        this.blockRepository$ = new BehaviorSubject(
          this.repositoryFactoryHttp$.getValue().createBlockRepository()
        );
      }
      if (this.chainRepository$ instanceof BehaviorSubject) {
        this.chainRepository$.next(
          this.repositoryFactoryHttp$.getValue().createChainRepository()
        );
      } else {
        this.chainRepository$ = new BehaviorSubject(
          this.repositoryFactoryHttp$.getValue().createChainRepository()
        );
      }
      if (this.networkRepository$ instanceof BehaviorSubject) {
        this.networkRepository$.next(
          this.repositoryFactoryHttp$.getValue().createNetworkRepository()
        );
      } else {
        this.networkRepository$ = new BehaviorSubject(
          this.repositoryFactoryHttp$.getValue().createNetworkRepository()
        );
      }
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

  getChainInfo$(): Observable<symbolSdk.ChainInfo> | undefined {
    if (this.chainRepository$ instanceof BehaviorSubject) {
      return this.chainRepository$.pipe(
        mergeMap((chainRepository) => chainRepository.getChainInfo())
      );
    } else {
      return undefined;
    }
  }

  getPageBlockInfo$(
    blockSearchCriteria: BlockSearchCriteria
  ): Observable<symbolSdk.Page<symbolSdk.BlockInfo>> | undefined {
    if (this.blockRepository$ instanceof BehaviorSubject) {
      return this.blockRepository$.pipe(
        mergeMap((blockRepository) =>
          blockRepository.search(
            this.convertBlockSearchCriteria(blockSearchCriteria)
          )
        )
      );
    } else {
      return undefined;
    }
  }

  getBlockInfo$(height: bigint): Observable<symbolSdk.BlockInfo> | undefined {
    if (this.blockRepository$ instanceof BehaviorSubject) {
      return this.blockRepository$.pipe(
        mergeMap((blockRepository) =>
          blockRepository.getBlockByHeight(
            symbolSdk.UInt64.fromUint(parseInt(height.toString()))
          )
        )
      );
    } else {
      return undefined;
    }
  }

  getBlock$(height: bigint): Observable<Block> | undefined {
    this.blockInfo$ = this.getBlockInfo$(height);
    this.networkConfiguration$ = this.networkRepository$?.pipe(
      mergeMap((networkRepository) => networkRepository.getNetworkProperties())
    );
    if (
      this.blockInfo$ instanceof Observable &&
      this.networkConfiguration$ instanceof Observable
    ) {
      return combineLatest([this.blockInfo$, this.networkConfiguration$]).pipe(
        map(([blockInfo, networkConfiguration]) => {
          const unixTimestampMilliseconds =
            parseInt(blockInfo.timestamp.toString()) +
            1000 *
              (networkConfiguration.network.epochAdjustment
                ? parseInt(networkConfiguration.network.epochAdjustment)
                : 0);
          const block: Block = {
            height: BigInt(blockInfo.height.toString()),
            hash: blockInfo.hash,
            timestamp: blockInfo.timestamp.toString(),
            date: new Date(unixTimestampMilliseconds),
            beneficiaryAddress: blockInfo.beneficiaryAddress.plain(),
            signerAddress: blockInfo.signer.address.plain(),
            fee: BigInt(blockInfo.totalFee.toString()),
            transactionsCount: blockInfo.transactionsCount,
            totalTransactionsCount: blockInfo.totalTransactionsCount,
          };
          return block;
        })
      );
    } else {
      return undefined;
    }
  }

  getLatestBlock$(): Observable<Block | undefined> | undefined {
    this.chainInfo$ = this.getChainInfo$();
    if (this.chainInfo$ !== undefined) {
      return this.chainInfo$.pipe(
        mergeMap((chainInfo) => {
          const latestBlock$ = this.getBlock$(
            BigInt(chainInfo.height.toString())
          );
          return latestBlock$ ? latestBlock$ : of(undefined);
        })
      );
    } else {
      return undefined;
    }
  }

  getBlocks$(
    blockSearchCriteria: BlockSearchCriteria
  ): Observable<Blocks> | undefined {
    this.chainInfo$ = this.getChainInfo$();
    this.pageBlockInfo$ = this.getPageBlockInfo$(blockSearchCriteria);
    if (
      this.chainInfo$ instanceof Observable &&
      this.pageBlockInfo$ instanceof Observable
    ) {
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
    } else {
      return undefined;
    }
  }
}
