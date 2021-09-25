import { TestBed } from '@angular/core/testing';

import { WalletInfrastructureService } from './wallet-infrastructure.service';

describe('WalletInfrastructureService', () => {
  let service: WalletInfrastructureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletInfrastructureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
