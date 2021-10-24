import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Account } from 'src/app/model/account/account.model';
import { AccountService } from 'src/app/model/account/account.service';
import { Mosaic } from 'src/app/model/mosaic/mosaic.model';
import { MosaicService } from 'src/app/model/mosaic/mosaic.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {
  address$?: Observable<string>;
  account$?: Observable<Account | undefined>;
  mosaics$?: Observable<Mosaic[] | undefined>;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private mosaicService: MosaicService
  ) {
    this.address$ = this.route.params.pipe(map((params) => params.address));
    this.account$ = this.address$.pipe(
      mergeMap((address) => {
        const account$ = this.accountService.getAccount$(address);
        if (account$ === undefined) {
          return of(undefined);
        }
        return account$;
      })
    );
    this.mosaics$ = this.address$.pipe(
      mergeMap((address) => {
        const mosaics$ = this.mosaicService.getMosaicsFromAddress$(address);
        if (mosaics$ === undefined) {
          return of(undefined);
        }
        return mosaics$;
      })
    );
  }
}
