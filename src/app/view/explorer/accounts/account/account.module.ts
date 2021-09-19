import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewAccountComponent } from './account.component';
import { ViewMaterialModule } from 'src/app/view/material.module';

@NgModule({
  declarations: [ViewAccountComponent],
  imports: [CommonModule, ViewMaterialModule],
  exports: [ViewAccountComponent],
})
export class ViewAccountModule {}
