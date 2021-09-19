import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewHomeModule } from './home/home.module';
import { ViewExplorerModule } from './explorer/explorer.module';
import { ViewAccountsModule } from './explorer/accounts/accounts.module';
import { ViewAccountModule } from './explorer/accounts/account/account.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ViewHomeModule,
    ViewExplorerModule,
    ViewAccountsModule,
    ViewAccountModule,
  ],
})
export class ViewModule {}
