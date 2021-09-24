import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewWalletComponent } from './wallet.component';
import { ViewMaterialModule } from '../material.module';

@NgModule({
  declarations: [ViewWalletComponent],
  imports: [CommonModule, ViewMaterialModule],
  exports: [ViewWalletComponent],
})
export class ViewWalletModule {}
