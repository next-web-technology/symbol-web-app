import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import { ViewTransactionsModule } from 'src/app/view/explorer/transactions/transactions.module';

@NgModule({
  declarations: [TransactionsComponent],
  imports: [CommonModule, TransactionsRoutingModule, ViewTransactionsModule],
})
export class TransactionsModule {}
