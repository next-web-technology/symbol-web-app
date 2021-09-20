import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewAccountsComponent } from './accounts.component';
import { ViewMaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewAccountsComponent],
  imports: [CommonModule, RouterModule, FormsModule, ViewMaterialModule],
  exports: [ViewAccountsComponent],
})
export class ViewAccountsModule {}
