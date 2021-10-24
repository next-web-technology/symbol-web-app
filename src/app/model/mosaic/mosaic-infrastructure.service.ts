import { Injectable } from '@angular/core';
import { NodeService } from '../node/node.service';
import * as symbolSdk from 'symbol-sdk';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
  private repositoryFactoryHttp$?: BehaviorSubject<symbolSdk.RepositoryFactoryHttp>;
  private mosaicRepository$?: BehaviorSubject<symbolSdk.MosaicRepository>;
  private accountRepository$?: BehaviorSubject<symbolSdk.AccountRepository>;
  private nameSpaceRepository$?: BehaviorSubject<symbolSdk.NamespaceRepository>;
  private mosaicService$?: BehaviorSubject<symbolSdk.MosaicService>;

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
      if (this.accountRepository$ instanceof BehaviorSubject) {
        this.accountRepository$.next(
          this.repositoryFactoryHttp$.getValue().createAccountRepository()
        );
      } else {
        this.accountRepository$ = new BehaviorSubject(
          this.repositoryFactoryHttp$.getValue().createAccountRepository()
        );
      }
      if (this.mosaicRepository$ instanceof BehaviorSubject) {
        this.mosaicRepository$.next(
          this.repositoryFactoryHttp$.getValue().createMosaicRepository()
        );
      } else {
        this.mosaicRepository$ = new BehaviorSubject(
          this.repositoryFactoryHttp$.getValue().createMosaicRepository()
        );
      }
      if (this.nameSpaceRepository$ instanceof BehaviorSubject) {
        this.nameSpaceRepository$.next(
          this.repositoryFactoryHttp$.getValue().createNamespaceRepository()
        );
      } else {
        this.nameSpaceRepository$ = new BehaviorSubject(
          this.repositoryFactoryHttp$.getValue().createNamespaceRepository()
        );
      }
      if (this.mosaicService$ instanceof BehaviorSubject) {
        this.mosaicService$.next(
          new symbolSdk.MosaicService(
            this.accountRepository$.getValue(),
            this.mosaicRepository$.getValue()
          )
        );
      } else {
        this.mosaicService$ = new BehaviorSubject(
          new symbolSdk.MosaicService(
            this.accountRepository$.getValue(),
            this.mosaicRepository$.getValue()
          )
        );
      }
    });
  }

  getMosaicsFromAddress$(
    address: string
  ): Observable<Mosaic[] | undefined> | undefined {
    const symbolAddress = symbolSdk.Address.createFromRawAddress(address);
    if (
      this.mosaicService$ === undefined ||
      this.nameSpaceRepository$ === undefined
    ) {
      return undefined;
    }
    return this.mosaicService$.pipe(
      mergeMap((mosaicService) => {
        return mosaicService.mosaicsAmountViewFromAddress(symbolAddress);
      }),
      map((mosaicAmountViews) => {
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
        const mosaicNames$ = this.nameSpaceRepository$?.pipe(
          mergeMap((namespaceRepository) =>
            namespaceRepository.getMosaicsNames(mosaicIds)
          )
        );
        if (mosaicNames$ === undefined) {
          return of(undefined);
        }
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
