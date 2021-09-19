import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MosaicInfrastructureService } from './mosaic-infrastructure.service';
import { Mosaic } from './mosaic.model';

export interface InterfaceMosaicInfrastructureService {
  getMosaicsFromAddress$: (address: string) => Observable<Mosaic[]>;
}

@Injectable({
  providedIn: 'root',
})
export class MosaicService {
  constructor(
    private mosaicInfrastructureService: MosaicInfrastructureService
  ) {}

  getMosaicsFromAddress$(address: string): Observable<Mosaic[]> {
    return this.mosaicInfrastructureService.getMosaicsFromAddress$(address);
  }
}
