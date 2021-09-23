import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ViewBlocksComponent } from './blocks.component';
import { ViewMaterialModule } from 'src/app/view/material.module';

@NgModule({
  declarations: [ViewBlocksComponent],
  imports: [CommonModule, FormsModule, RouterModule, ViewMaterialModule],
  exports: [ViewBlocksComponent],
})
export class ViewBlocksModule {}
