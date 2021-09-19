import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
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
export class AccountComponent implements OnInit {
  address$?: Observable<string>;
  account$?: Observable<Account>;
  mosaics$?: Observable<Mosaic[]>;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private mosaicService: MosaicService
  ) {
    this.address$ = this.route.params.pipe(map((params) => params.address));
    this.account$ = this.address$.pipe(
      mergeMap((address) => this.accountService.getAccount$(address))
    );
    this.mosaics$ = this.address$.pipe(
      mergeMap((address) => this.mosaicService.getMosaicsFromAddress$(address))
    );
  }

  ngOnInit(): void {
    this.account$?.subscribe((account) => console.log(account));
    this.mosaics$?.subscribe((mosaics) => console.log(mosaics));
  }
}
