import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewHomeComponent } from './home.component';
import { ViewMaterialModule } from '../material.module';

@NgModule({
  declarations: [ViewHomeComponent],
  imports: [CommonModule, RouterModule, ViewMaterialModule],
  exports: [ViewHomeComponent],
})
export class ViewHomeModule {}
