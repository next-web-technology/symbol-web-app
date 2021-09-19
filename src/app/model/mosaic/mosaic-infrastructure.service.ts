import { Injectable } from '@angular/core';
import { NodeService } from '../node/node.service';
import * as symbolSdk from 'symbol-sdk';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Mosaic } from './mosaic.model';
import { InterfaceMosaicInfrastructureService } from './mosaic.service';

@Injectable({
  providedIn: 'root',
})
export class MosaicInfrastructureService
  implements InterfaceMosaicInfrastructureService
{
  private repositoryFactoryHttp$: BehaviorSubject<symbolSdk.RepositoryFactoryHttp>;
  private mosaicRepository$: BehaviorSubject<symbolSdk.MosaicRepository>;
  private accountRepository$: BehaviorSubject<symbolSdk.AccountRepository>;
  private mosaicService$: BehaviorSubject<symbolSdk.MosaicService>;

  constructor(private nodeService: NodeService) {
    this.repositoryFactoryHttp$ = new BehaviorSubject(
      new symbolSdk.RepositoryFactoryHttp(this.nodeService.nodeUrl$.getValue())
    );
    this.accountRepository$ = new BehaviorSubject(
      this.repositoryFactoryHttp$.getValue().createAccountRepository()
    );
    this.mosaicRepository$ = new BehaviorSubject(
      this.repositoryFactoryHttp$.getValue().createMosaicRepository()
    );
    this.mosaicService$ = new BehaviorSubject(
      new symbolSdk.MosaicService(
        this.accountRepository$.getValue(),
        this.mosaicRepository$.getValue()
      )
    );
    this.nodeService.nodeUrl$.subscribe((nodeUrl) => {
      this.repositoryFactoryHttp$.next(
        new symbolSdk.RepositoryFactoryHttp(nodeUrl)
      );
      this.accountRepository$.next(
        this.repositoryFactoryHttp$.getValue().createAccountRepository()
      );
      this.mosaicRepository$.next(
        this.repositoryFactoryHttp$.getValue().createMosaicRepository()
      );
      this.mosaicService$.next(
        new symbolSdk.MosaicService(
          this.accountRepository$.getValue(),
          this.mosaicRepository$.getValue()
        )
      );
    });
  }

  getMosaicsFromAddress$(address: string): Observable<Mosaic[]> {
    const symbolAddress = symbolSdk.Address.createFromRawAddress(address);
    return this.mosaicService$.pipe(
      mergeMap((mosaicService) => {
        return mosaicService.mosaicsAmountViewFromAddress(symbolAddress);
      }),
      map((mosaicAmountViews) => {
        console.log('mosaicAmountViews', mosaicAmountViews);
        return mosaicAmountViews.map((mosaicAmountView) => {
          const mosaic: Mosaic = {
            id: mosaicAmountView.mosaicInfo.id.toHex(),
            name: mosaicAmountView.fullName(),
            amount: BigInt(mosaicAmountView.amount.toString()),
            relativeAmount: mosaicAmountView.relativeAmount(),
          };
          return mosaic;
        });
      })
    );
  }
}
