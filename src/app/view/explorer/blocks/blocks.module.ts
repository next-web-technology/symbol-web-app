import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewBlocksComponent } from './blocks.component';
import { ViewMaterialModule } from 'src/app/view/material.module';

@NgModule({
  declarations: [ViewBlocksComponent],
  imports: [CommonModule, ViewMaterialModule],
  exports: [ViewBlocksComponent],
})
export class ViewBlocksModule {}
