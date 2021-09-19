import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './accounts.component';
import { AccountComponent } from './account/account.component';
import { ViewAccountsModule } from 'src/app/view/explorer/accounts/accounts.module';
import { ViewAccountModule } from 'src/app/view/explorer/accounts/account/account.module';

@NgModule({
  declarations: [AccountsComponent, AccountComponent],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    ViewAccountsModule,
    ViewAccountModule,
  ],
})
export class AccountsModule {}
