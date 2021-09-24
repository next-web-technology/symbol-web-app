import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet.component';
import { ViewWalletModule } from 'src/app/view/wallet/wallet.module';
import { ImportComponent } from './import/import.component';
import { ViewImportModule } from 'src/app/view/wallet/import/import.module';

@NgModule({
  declarations: [WalletComponent, ImportComponent],
  imports: [
    CommonModule,
    WalletRoutingModule,
    ViewWalletModule,
    ViewImportModule,
  ],
})
export class WalletModule {}
