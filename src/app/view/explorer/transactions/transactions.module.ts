import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewTransactionsComponent } from './transactions.component';

@NgModule({
  declarations: [ViewTransactionsComponent],
  imports: [CommonModule],
  exports: [ViewTransactionsComponent],
})
export class ViewTransactionsModule {}
