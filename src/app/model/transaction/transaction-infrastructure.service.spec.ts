import { TestBed } from '@angular/core/testing';

import { TransactionInfrastructureService } from './transaction-infrastructure.service';

describe('TransactionInfrastructureService', () => {
  let service: TransactionInfrastructureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionInfrastructureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
