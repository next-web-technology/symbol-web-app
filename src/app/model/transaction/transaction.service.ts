import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionInfrastructureService } from './transaction-infrastructure.service';
import {
  Transaction,
  TransactionAnnounceResponse,
  TransactionMonitorResponse,
} from './transaction.model';

export interface InterfaceTransactionInfrastructureService {
  sendTransaction$: (
    transaction: Transaction
  ) => Observable<TransactionAnnounceResponse>;
  monitorTransaction$: (hash: string) => Observable<TransactionMonitorResponse>;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(
    private transactionInfrastructureService: TransactionInfrastructureService
  ) {}

  sendTransaction$(
    transaction: Transaction
  ): Observable<TransactionAnnounceResponse> {
    return this.transactionInfrastructureService.sendTransaction$(transaction);
  }

  monitorTransaction$(hash: string): Observable<TransactionMonitorResponse> {
    return this.transactionInfrastructureService.monitorTransaction$(hash);
  }
}
