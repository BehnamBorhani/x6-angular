import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  ViewChild,
} from '@angular/core';
import { Graph } from '@antv/x6';
import { register } from '@antv/x6-angular-shape';
import { Snapline } from '@antv/x6-plugin-snapline';
import { CustomNodeComponent } from 'src/app/components/custom-node/custom-node.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements AfterViewInit {
  public graph!: Graph;
  @ViewChild('container') containerElemRef!: ElementRef<HTMLDivElement>;

  data = {
    // 节点
    nodes: [
      {
        id: 'node1', // String，可选，节点的唯一标识
        shape: 'ellipse',
        x: 40, // Number，必选，节点位置的 x 值
        y: 40, // Number，必选，节点位置的 y 值
        width: 80, // Number，可选，节点大小的 width 值
        height: 40, // Number，可选，节点大小的 height 值
        label: 'hello', // String，节点标签
      },
      {
        id: 'node2', // String，节点的唯一标识
        shape: 'rect',
        x: 160, // Number，必选，节点位置的 x 值
        y: 180, // Number，必选，节点位置的 y 值
        width: 80, // Number，可选，节点大小的 width 值
        height: 40, // Number，可选，节点大小的 height 值
        label: 'world', // String，节点标签
      },
    ],
    // 边
    edges: [
      {
        source: 'node1', // String，必须，起始节点 id
        target: 'node2', // String，必须，目标节点 id
        attrs: {
          line: {
            stroke: 'red',
          },
        },
      },
    ],
  };

  constructor(private injector: Injector) {}

  ngAfterViewInit() {
    this.graph = new Graph({
      container: this.containerElemRef.nativeElement,
      /* width: 1000,
      height: 600, */
      background: {
        color: '#F2F7FA',
      },
      grid: true,
      panning: {
        enabled: true,
        // modifiers: 'shift',
        eventTypes: ['leftMouseDown', 'rightMouseDown', 'mouseWheel'],
      },
      autoResize: true,
    });

    // this.graph.isPannable();
    this.graph.enablePanning();
    // this.graph.disablePanning()
    // this.graph.togglePanning();

    // this.graph.zoom();
    // this.graph.zoom(0.2);
    // this.graph.zoom(-0.2);

    this.graph.centerContent(); //The most common method is to align the center of the canvas content with the center of the viewport. Usage:

    this.graph.fromJSON(this.data);

    this.graph.use(
      new Snapline({
        enabled: true,
      })
    );
  }
}
