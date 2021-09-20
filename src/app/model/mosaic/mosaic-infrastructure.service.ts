import { Injectable } from '@angular/core';
import { NodeService } from '../node/node.service';
import * as symbolSdk from 'symbol-sdk';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Mosaic } from './mosaic.model';
import { InterfaceMosaicInfrastructureService } from './mosaic.service';
import { KNOWN_MOSICS } from './mosaic';

@Injectable({
  providedIn: 'root',
})
export class MosaicInfrastructureService
  implements InterfaceMosaicInfrastructureService
{
  private repositoryFactoryHttp$: BehaviorSubject<symbolSdk.RepositoryFactoryHttp>;
  private mosaicRepository$: BehaviorSubject<symbolSdk.MosaicRepository>;
  private accountRepository$: BehaviorSubject<symbolSdk.AccountRepository>;
  private nameSpaceRepository$: BehaviorSubject<symbolSdk.NamespaceRepository>;
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
    this.nameSpaceRepository$ = new BehaviorSubject(
      this.repositoryFactoryHttp$.getValue().createNamespaceRepository()
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
      this.nameSpaceRepository$.next(
        this.repositoryFactoryHttp$.getValue().createNamespaceRepository()
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
      }),
      mergeMap((mosaics) => {
        const mosaicIds: symbolSdk.MosaicId[] = mosaics.map(
          (mosaic) => new symbolSdk.MosaicId(mosaic.id)
        );
        const mosaicNames$ = this.nameSpaceRepository$.pipe(
          mergeMap((namespaceRepository) =>
            namespaceRepository.getMosaicsNames(mosaicIds)
          )
        );
        return mosaicNames$.pipe(
          map((mosaicNames) => {
            return mosaics.map((mosaic) => {
              mosaicNames.forEach((mosaicName) => {
                if (mosaicName.mosaicId.toHex() === mosaic.id) {
                  mosaic.name =
                    mosaicName.names.length > 0
                      ? mosaicName.names[0].name
                      : '-';
                }
              });
              KNOWN_MOSICS.forEach((knownMosaic) => {
                if (knownMosaic.name === mosaic.name) {
                  mosaic.icon = knownMosaic.icon;
                }
              });
              return mosaic;
            });
          })
        );
      })
    );
  }
}
