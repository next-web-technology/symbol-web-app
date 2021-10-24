import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NodeInfrastructureService } from './node-infrastructure.service';
import { Node } from './node.model';

export interface InterfaceNodeInfrastructureService {
  getNodes$: (network: 'mainnet' | 'testnet') => BehaviorSubject<Node[]>;
}

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  network$: BehaviorSubject<string> = new BehaviorSubject('mainnet');
  nodes$?: BehaviorSubject<Node[]>;
  node$?: BehaviorSubject<Node>;
  nodeUrls$?: BehaviorSubject<string[]>;
  nodeUrl$?: BehaviorSubject<string>;

  constructor(private nodeInfrastructureService: NodeInfrastructureService) {
    this.network$.subscribe((network) => {
      this.nodeInfrastructureService.getNodes$(network).subscribe((nodes) => {
        if (this.nodes$ instanceof BehaviorSubject) {
          this.nodes$.next(nodes);
        } else {
          this.nodes$ = new BehaviorSubject(nodes);
        }
      });
    });
    this.nodes$?.subscribe((nodes) => {
      if (this.nodeUrls$ instanceof BehaviorSubject) {
        this.nodeUrls$.next(this.nodesToNodeUrls(nodes));
      } else {
        this.nodeUrls$ = new BehaviorSubject(this.nodesToNodeUrls(nodes));
      }
      if (this.node$ instanceof BehaviorSubject) {
        this.node$.next(this.returnRandomNode(nodes));
      } else {
        this.node$ = new BehaviorSubject(this.returnRandomNode(nodes));
      }
      if (this.nodeUrl$ instanceof BehaviorSubject) {
        this.nodeUrl$.next(this.nodeToNodeUrl(this.node$.getValue()));
      } else {
        this.nodeUrl$ = new BehaviorSubject(
          this.nodeToNodeUrl(this.node$.getValue())
        );
      }
    });
  }

  nodeToNodeUrl(node: Node): string {
    return `${node.protocol}://${node.domain}:${node.port}`;
  }

  nodesToNodeUrls(nodes: Node[]): string[] {
    return nodes.map((node) => this.nodeToNodeUrl(node));
  }

  returnRandomNode(nodes: Node[]): Node {
    const randomIndex = Math.floor(Math.random() * nodes.length);
    return nodes[randomIndex];
  }

  resetRandomNode(): void {
    if (this.nodes$ instanceof BehaviorSubject) {
      this.node$?.next(this.returnRandomNode(this.nodes$.getValue()));
    }
    if (this.node$ instanceof BehaviorSubject) {
      this.nodeUrl$?.next(this.nodeToNodeUrl(this.node$.getValue()));
    }
  }

  selectNetwork(network: string): void {
    if (this.network$ instanceof BehaviorSubject) {
      this.network$.next(network);
    } else {
      this.network$ = new BehaviorSubject(network);
    }
  }

  selectNode(node: Node): void {
    if (this.node$ instanceof BehaviorSubject) {
      this.node$.next(node);
      this.nodeUrl$?.next(this.nodeToNodeUrl(this.node$.getValue()));
    }
  }

  selectNodeUrl(nodeUrl: string): void {
    this.nodeUrl$?.next(nodeUrl);
    if (this.nodes$ instanceof BehaviorSubject) {
      const matchingNode = this.nodes$
        .getValue()
        .filter((node) => this.nodeToNodeUrl(node) === nodeUrl)[0];
      if (this.node$ instanceof BehaviorSubject) {
        this.node$.next(matchingNode);
      }
    }
  }
}
