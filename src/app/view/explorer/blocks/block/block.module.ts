import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewBlockComponent } from './block.component';
import { ViewMaterialModule } from 'src/app/view/material.module';

@NgModule({
  declarations: [ViewBlockComponent],
  imports: [CommonModule, ViewMaterialModule],
  exports: [ViewBlockComponent],
})
export class ViewBlockModule {}
