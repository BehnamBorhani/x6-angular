import { Component } from '@angular/core';
import { NodeService } from './services/node.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isCollapsed = false;

  constructor(private nodeService: NodeService) {}

  onCreateNode() {
    let randomId = crypto.randomUUID();
    this.nodeService.createNode({
      id: randomId,
      shape: 'rect',
      x: 220,
      y: 220,
      width: 100,
      height: 50,
      label: 'New Node',
    });
  }
}
