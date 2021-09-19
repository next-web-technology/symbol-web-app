import { TestBed } from '@angular/core/testing';

import { AccountInfrastructureService } from './account-infrastructure.service';

describe('AccountInfrastructureService', () => {
  let service: AccountInfrastructureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountInfrastructureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
