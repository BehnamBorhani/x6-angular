import { Injectable } from '@angular/core';
import { Shape } from '@antv/x6';
import { Node } from '../models/node.interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  public nodeChanged = new Subject<Node[]>();
  public nodes: Node[] = [
    {
      id: 'node1',
      shape: 'ellipse',
      x: -100,
      y: 100,
      width: 80,
      height: 40,
      label: 'hello',
    },
    {
      id: 'node2',
      shape: 'rect',
      x: 300,
      y: 100,
      width: 80,
      height: 40,
      label: 'world',
    },
  ];

  get getNodes() {
    return this.nodes.slice();
  }

  constructor() {}

  createNode(newNode: Node) {
    this.nodes.push(newNode);
    this.nodeChanged.next(this.nodes.slice());
  }
}
