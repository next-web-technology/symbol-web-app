import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NodeInfrastructureService } from './node-infrastructure.service';
import { Node } from './node.model';

export interface InterfaceNodeInfrastructureService {
  getNodes$: () => BehaviorSubject<Node[]>;
}

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  network$: BehaviorSubject<string> = new BehaviorSubject('mainnet');
  nodes$: BehaviorSubject<Node[]>;
  node$: BehaviorSubject<Node>;
  nodeUrls$: BehaviorSubject<string[]>;
  nodeUrl$: BehaviorSubject<string>;

  constructor(private nodeInfrastructureService: NodeInfrastructureService) {
    this.nodes$ = this.nodeInfrastructureService.getNodes$();
    this.nodeUrls$ = new BehaviorSubject(
      this.nodesToNodeUrls(this.nodes$.getValue())
    );
    this.node$ = new BehaviorSubject(
      this.returnRandomNode(this.nodes$.getValue())
    );
    this.nodeUrl$ = new BehaviorSubject(
      this.nodeToNodeUrl(this.node$.getValue())
    );
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
    this.node$.next(this.returnRandomNode(this.nodes$.getValue()));
    this.nodeUrl$.next(this.nodeToNodeUrl(this.node$.getValue()));
  }

  selectNode(node: Node): void {
    this.node$.next(node);
    this.nodeUrl$.next(this.nodeToNodeUrl(this.node$.getValue()));
  }

  selectNodeUrl(nodeUrl: string): void {
    this.nodeUrl$.next(nodeUrl);
    const matchingNode = this.nodes$
      .getValue()
      .filter((node) => this.nodeToNodeUrl(node) === nodeUrl)[0];
    this.node$.next(matchingNode);
  }
}
