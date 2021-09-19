import { TestBed } from '@angular/core/testing';

import { MosaicInfrastructureService } from './mosaic-infrastructure.service';

describe('MosaicInfrastructureService', () => {
  let service: MosaicInfrastructureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MosaicInfrastructureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
