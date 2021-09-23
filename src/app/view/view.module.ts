import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewHomeModule } from './home/home.module';
import { ViewExplorerModule } from './explorer/explorer.module';
import { ViewAccountsModule } from './explorer/accounts/accounts.module';
import { ViewAccountModule } from './explorer/accounts/account/account.module';
import { ViewBlocksModule } from './explorer/blocks/blocks.module';
import { ViewBlockModule } from './explorer/blocks/block/block.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ViewHomeModule,
    ViewExplorerModule,
    ViewAccountsModule,
    ViewAccountModule,
    ViewBlocksModule,
    ViewBlockModule,
  ],
})
export class ViewModule {}
