import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as symbolSdk from 'symbol-sdk';
import { environment } from 'src/environments/environment';
import {
  MAINNET_HTTPS_NODES,
  MAINNET_HTTP_NODES,
  TESTNET_HTTPS_NODES,
  TESTNET_HTTP_NODES,
} from './node';
import { Node } from './node.model';
import { InterfaceNodeInfrastructureService } from './node.service';

@Injectable({
  providedIn: 'root',
})
export class NodeInfrastructureService
  implements InterfaceNodeInfrastructureService
{
  constructor() {}

  getNodes$(network: string): BehaviorSubject<Node[]> {
    if (network === 'mainnet') {
      if (environment.production) {
        return new BehaviorSubject(MAINNET_HTTPS_NODES);
      } else {
        return new BehaviorSubject(MAINNET_HTTP_NODES);
      }
    } else if (network === 'testnet') {
      if (environment.production) {
        return new BehaviorSubject(TESTNET_HTTPS_NODES);
      } else {
        return new BehaviorSubject(TESTNET_HTTP_NODES);
      }
    } else {
      throw Error('unknown network!');
    }
  }
}
