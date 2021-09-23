import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewBlockComponent } from './block.component';
import { ViewMaterialModule } from 'src/app/view/material.module';

@NgModule({
  declarations: [ViewBlockComponent],
  imports: [CommonModule, RouterModule, ViewMaterialModule],
  exports: [ViewBlockComponent],
})
export class ViewBlockModule {}
