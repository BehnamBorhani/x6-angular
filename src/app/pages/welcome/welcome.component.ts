import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Cell, Graph, Markup, Model } from '@antv/x6';
import { register } from '@antv/x6-angular-shape';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { CustomNodeComponent } from 'src/app/components/custom-node/custom-node.component';
import { Node } from 'src/app/models/node.interface';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, AfterViewInit {
  public graph!: Graph;
  @ViewChild('container') containerElemRef!: ElementRef<HTMLDivElement>;

  data = {
    // 节点
    nodes: [
      {
        id: 'node1', // String，可选，节点的唯一标识
        shape: 'ellipse',
        x: -50, // Number，必选，节点位置的 x 值
        y: -50, // Number，必选，节点位置的 y 值
        width: 80, // Number，可选，节点大小的 width 值
        height: 40, // Number，可选，节点大小的 height 值
        label: 'hello', // String，节点标签
      },
      {
        id: 'node2', // String，节点的唯一标识
        shape: 'rect',
        x: 50, // Number，必选，节点位置的 x 值
        y: 50, // Number，必选，节点位置的 y 值
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
        router: {
          name: 'manhattan',
          args: {
            side: 'right',
          },
        },
      },
    ],
  };

  constructor(private injector: Injector, private nodeService: NodeService) {}

  ngOnInit(): void {
    this.data.nodes = this.nodeService.getNodes;
    this.nodeService.nodeChanged.subscribe((nodes: Node[]) => {
      this.data.nodes = nodes;
      this.graph.addNodes(nodes);
    });
  }

  ngAfterViewInit() {
    this.graph = new Graph({
      container: this.containerElemRef.nativeElement,
      /* width: 1000,
      height: 600, */
      background: {
        color: '#F2F7FA',
      },
      grid: true,
      onEdgeLabelRendered: (args) => {
        const { selectors } = args;
        console.log(selectors);
        const content = selectors['foContent'] as HTMLDivElement;
        if (content) {
          const btn = document.createElement('button');
          btn.appendChild(document.createTextNode('HTML Button'));
          btn.style.width = '100%';
          btn.style.height = '100%';
          btn.style.lineHeight = '1';
          btn.style.borderRadius = '4px';
          btn.style.textAlign = 'center';
          btn.style.color = '#000';
          btn.style.background = '#ffd591';
          btn.style.border = '2px solid #ffa940';

          btn.addEventListener('click', () => {
            alert('clicked');
          });
          content.appendChild(btn);
          return undefined;
        }
      },
      /* panning: {
        enabled: true,
        // modifiers: 'shift',
        eventTypes: ['leftMouseDown', 'rightMouseDown', 'mouseWheel'],
      }, */
      autoResize: true,
    });

    register({
      shape: 'custom-node',
      content: CustomNodeComponent,
      injector: this.injector,
      width: 120,
      height: 20,
    });

    // this.graph.isPannable();
    // this.graph.enablePanning();
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
    this.graph.use(
      new Selection({
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      })
    );

    this.graph.on(
      'node:selected',
      (args: { cell: Cell; options: Model.SetOptions; node: Node }) => {
        console.log(args.node);
      }
    );

    this.graph.addNodes([
      ...this.nodeService.nodes,
      {
        shape: 'custom-node',
        x: 100,
        y: 100,
        data: {
          // Input parameters must be placed here
          ngArguments: {
            value: 'Oh my god',
          },
        },
      },
    ]);
    // this.graph.addEdge({
    //   source: 'node1',
    //   target: 'node2',
    //   defaultLabel: {
    //     markup: Markup.getForeignObjectMarkup(),
    //     attrs: {
    //       fo: {
    //         width: 120,
    //         height: 30,
    //         x: -60,
    //         y: -15,
    //       },
    //     },
    //   },
    //   label: {
    //     position: 0.5,
    //   },
    //   attrs: {
    //     line: {
    //       stroke: '#ccc',
    //     },
    //   },
    // });
  }
}
