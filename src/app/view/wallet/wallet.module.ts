import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewWalletComponent } from './wallet.component';
import { ViewMaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewWalletComponent],
  imports: [CommonModule, FormsModule, ViewMaterialModule],
  exports: [ViewWalletComponent],
})
export class ViewWalletModule {}
