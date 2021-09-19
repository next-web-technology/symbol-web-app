import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewAccountsComponent } from './accounts.component';

@NgModule({
  declarations: [ViewAccountsComponent],
  imports: [CommonModule],
  exports: [ViewAccountsComponent],
})
export class ViewAccountsModule {}
