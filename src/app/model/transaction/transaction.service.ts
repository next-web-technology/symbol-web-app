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
  ) => Observable<TransactionAnnounceResponse> | undefined;
  monitorTransaction$: (
    hash: string
  ) => Observable<TransactionMonitorResponse> | undefined;
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
  ): Observable<TransactionAnnounceResponse> | undefined {
    return this.transactionInfrastructureService.sendTransaction$(transaction);
  }

  monitorTransaction$(
    hash: string
  ): Observable<TransactionMonitorResponse> | undefined {
    return this.transactionInfrastructureService.monitorTransaction$(hash);
  }
}
