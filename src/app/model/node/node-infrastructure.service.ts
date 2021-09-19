import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MAINNET_HTTPS_NODES, MAINNET_HTTP_NODES } from './node';
import { Node } from './node.model';
import { InterfaceNodeInfrastructureService } from './node.service';

@Injectable({
  providedIn: 'root',
})
export class NodeInfrastructureService
  implements InterfaceNodeInfrastructureService
{
  constructor() {}

  getNodes$(): BehaviorSubject<Node[]> {
    if (environment.production) {
      return new BehaviorSubject(MAINNET_HTTPS_NODES);
    } else {
      return new BehaviorSubject(MAINNET_HTTP_NODES);
    }
  }
}
