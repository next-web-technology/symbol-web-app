import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet.component';
import { ViewWalletModule } from 'src/app/view/wallet/wallet.module';

@NgModule({
  declarations: [WalletComponent],
  imports: [CommonModule, WalletRoutingModule, ViewWalletModule],
})
export class WalletModule {}
