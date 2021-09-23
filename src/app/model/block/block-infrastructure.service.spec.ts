import { TestBed } from '@angular/core/testing';

import { BlockInfrastructureService } from './block-infrastructure.service';

describe('BlockInfrastructureService', () => {
  let service: BlockInfrastructureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockInfrastructureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
