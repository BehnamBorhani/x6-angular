import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CircularLayout, DagreLayout, GridLayout } from '@antv/layout';
import { Cell, Graph, Markup, Model } from '@antv/x6';
import { register } from '@antv/x6-angular-shape';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Stencil } from '@antv/x6-plugin-stencil';
import { Transform } from '@antv/x6-plugin-transform';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { CustomNodeComponent } from 'src/app/components/custom-node/custom-node.component';
import { DrawerComponent } from 'src/app/components/drawer/drawer.component';
import { Node } from 'src/app/models/node.interface';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, AfterViewInit {
  public graph!: Graph;
  public commonAttrs = {
    body: {
      fill: '#fff',
      stroke: '#8f8f8f',
      strokeWidth: 1,
    },
  };

  @ViewChild('container') containerElemRef!: ElementRef<HTMLDivElement>;
  @ViewChild('stencil') stencilElemRef!: ElementRef<HTMLDivElement>;

  data = {
    // 节点
    nodes: [
      {
        id: 'node1', // String，可选，节点的唯一标识
        shape: 'ellipse',
        /* x: -50, // Number，必选，节点位置的 x 值
        y: -50, // Number，必选，节点位置的 y 值 */
        width: 80, // Number，可选，节点大小的 width 值
        height: 40, // Number，可选，节点大小的 height 值
        label: 'hello', // String，节点标签
      },
      {
        id: 'node2', // String，节点的唯一标识
        shape: 'rect',
        /* x: 50, // Number，必选，节点位置的 x 值
        y: 50, // Number，必选，节点位置的 y 值 */
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

  constructor(
    private injector: Injector,
    private nodeService: NodeService,
    private drawerService: NzDrawerService
  ) {}

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
      connecting: {
        allowBlank: false,
        allowNode: false,
        snap: true,
        validateConnection({
          sourceCell,
          targetCell,
          sourceMagnet,
          targetMagnet,
        }) {
          // Cannot connect to itself
          if (sourceCell === targetCell) {
            return false;
          }

          // You can only connect from the output connection pile to the input connection pile
          if (
            !sourceMagnet ||
            sourceMagnet.getAttribute('port-group') === 'input'
          ) {
            return false;
          }

          if (
            !targetMagnet ||
            targetMagnet.getAttribute('port-group') !== 'input'
          ) {
            return false;
          }

          // Do not connect repeatedly
          /* const edges = this.getEdges();
          const portId = targetMagnet.getAttribute('port');
          if (edges.find((edge) => edge.getTargetPortId() === portId)) {
            return false;
          } */

          return true;
        },
      },
      highlighting: {
        // Render a bounding box around the connection pile when it can be connected
        magnetAvailable: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#ff00ff',
              strokeWidth: 6,
            },
          },
        },
        // Render a bounding box around the connection pile when the connection pile is adsorbed
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
              strokeWidth: 8,
            },
          },
        },
      },
    });

    register({
      shape: 'custom-node',
      content: CustomNodeComponent,
      injector: this.injector,
      width: 120,
      height: 20,
    });

    for (let i = 1; i <= 30; i++) {
      this.data.nodes!.push({
        id: `${i}`,
        shape: 'circle',
        width: 32,
        height: 32,
        /* attrs: {
          body: {
            fill: '#5F95FF',
            stroke: 'transparent',
          },
          label: {
            fill: '#ffffff',
          },
        }, */
        label: `${i}`,
      });
    }

    const gridLayout = new GridLayout({
      type: 'grid',
      width: this.graph.container.clientWidth,
      height: this.graph.container.clientHeight,
      // center: [300, 200],
      // rows: 4,
      // cols: 4,
      preventOverlap: false,
      preventOverlapPadding: 100,
    });

    const circularLayout = new CircularLayout({
      type: 'circular',
      // radius: 200,
      clockwise: false,
      width: this.graph.container.clientWidth,
      height: this.graph.container.clientHeight,
      // center: [300, 200],
      // divisions: 5,
      angleRatio: 3,
      // ordering: 'degree',
    });

    /* const gridLayout = new DagreLayout({
      type: 'dagre',
      rankdir: 'LR',
      align: 'UL',
      ranksep: 30,
      nodesep: 15,
      controlPoints: true,
    }); */

    let newLayout = gridLayout.layout(this.data);
    /* setTimeout(() => {
      newLayout = circularLayout.layout(this.data);
      newLayout.nodes?.forEach((modelNode) => {
        let node = this.graph
          .getNodes()
          .find((node) => node.id === modelNode.id)!;

        let deltaX,
          deltaY = 0;
        if ('x' in modelNode) {
          deltaX = <number>modelNode.x - node?.getPosition().x;
        }
        if ('y' in modelNode) {
          deltaY = <number>modelNode.y - node?.getPosition().y;
        }

        node.translate(deltaX, deltaY, {
          transition: {
            duration: 2000,
          },
        });
      });
      // this.graph.fromJSON(newLayout);
    }, 3000); */
    // console.log(newLayout);

    // this.graph.isPannable();
    // this.graph.enablePanning();
    // this.graph.disablePanning()
    // this.graph.togglePanning();

    // this.graph.zoom();
    // this.graph.zoom(0.2);
    // this.graph.zoom(-0.2);

    // this.graph.centerContent(); //The most common method is to align the center of the canvas content with the center of the viewport. Usage:

    // this.graph.fromJSON(this.data);
    this.graph.fromJSON(newLayout);

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

    this.graph.use(
      new Transform({
        resizing: {
          enabled: true,
          /* minWidth: 1,
          maxWidth: 200,
          minHeight: 1,
          maxHeight: 150, */
          orthogonal: true,
          restrict: false,
          preserveAspectRatio: false,
        },
        rotating: {
          enabled: true,
          grid: 15,
        },
      })
    );

    const stencil = new Stencil({
      title: 'Stencil',
      target: this.graph,
      search(cell, keyword) {
        return cell.shape.indexOf(keyword) !== -1;
      },
      placeholder: 'Search by shape name',
      notFoundText: 'Not Found',
      collapsable: true,
      stencilGraphHeight: 0,
      groups: [
        {
          name: 'group1',
          title: 'Group(Collapsable)',
        },
        {
          name: 'group2',
          title: 'Group',
          collapsable: false,
        },
      ],
    });

    const n1 = this.graph.createNode({
      shape: 'rect',
      width: 80,
      height: 40,
      label: 'rect',
      attrs: this.commonAttrs,
      ports: {
        groups: {
          input: {
            attrs: {
              circle: {
                r: 6,
                magnet: 'passive',
                stroke: '#31d0c6',
                fill: '#fff',
                strokeWidth: 2,
              },
            },
            position: 'left',
          },
          output: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#990000',
                fill: '#fff',
                strokeWidth: 2,
              },
            },
            position: 'right',
          },
        },
        items: [
          { id: 'input-port', group: 'input' },
          { id: 'output-port', group: 'output' },
        ],
      },
    });

    const n2 = this.graph.createNode({
      shape: 'circle',
      width: 40,
      height: 40,
      label: 'circle',
      attrs: this.commonAttrs,
    });

    const n3 = this.graph.createNode({
      shape: 'ellipse',
      width: 80,
      height: 40,
      label: 'ellipse',
      attrs: this.commonAttrs,
      ports: {
        groups: {
          input: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                fill: '#fff',
                strokeWidth: 2,
              },
            },
            position: 'left',
          },
          output: {
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#990000',
                fill: '#fff',
                strokeWidth: 2,
              },
            },
            position: 'right',
          },
        },
        items: [
          { id: 'input-port', group: 'input' },
          { id: 'output-port', group: 'output' },
        ],
      },
    });

    const n4 = this.graph.createNode({
      shape: 'path',
      width: 40,
      height: 40,
      // https://www.svgrepo.com/svg/13653/like
      path: 'M24.85,10.126c2.018-4.783,6.628-8.125,11.99-8.125c7.223,0,12.425,6.179,13.079,13.543c0,0,0.353,1.828-0.424,5.119c-1.058,4.482-3.545,8.464-6.898,11.503L24.85,48L7.402,32.165c-3.353-3.038-5.84-7.021-6.898-11.503c-0.777-3.291-0.424-5.119-0.424-5.119C0.734,8.179,5.936,2,13.159,2C18.522,2,22.832,5.343,24.85,10.126z',
      attrs: this.commonAttrs,
      label: 'path',
    });

    /* const n5: Node = this.graph.createNode({
      shape: 'custom-node',
      id: crypto.randomUUID(),
      width: 200,
      height: 100,
      x:0,
      y:0,
      label: "testy"
    }); */

    this.stencilElemRef.nativeElement.appendChild(stencil.container);
    stencil.load([n1, n2], 'group1');
    stencil.load([n3, n4], 'group2');

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

    this.graph.on('node:mouseenter', ({ node }) => {
      console.log(node);
      node.addTools({
        name: 'button-remove',
        args: {
          offset: { x: 10, y: 10 },
        },
      });
    });

    this.graph.on('node:mouseleave', ({ node }) => {
      node.removeTools();
    });

    this.graph.on('node:click', ({ node }) => {
      const nodeID = node.id;
      const { x, y } = node.getPosition();
      circularLayout.center = [x, y];
      circularLayout.angleRatio = 2 * Math.floor(Math.random() * 20) + 1;

      newLayout = circularLayout.layout(this.data);
      newLayout.nodes?.forEach((modelNode) => {
        let node = this.graph
          .getNodes()
          .find((n) => n.id !== nodeID && n.id === modelNode.id)!;

        let deltaX,
          deltaY = 0;
        if ('x' in modelNode) {
          deltaX = <number>modelNode.x - node?.getPosition().x;
        }
        if ('y' in modelNode) {
          deltaY = <number>modelNode.y - node?.getPosition().y;
        }

        node?.translate(deltaX, deltaY, {
          transition: {
            duration: 1000,
          },
        });

        node?.removeTools();
      });

      /* const drawerRef = this.drawerService.create({
        nzTitle: 'Node details',
        // nzFooter: 'Footer',
        // nzExtra: 'Extra',
        nzContent: DrawerComponent,
        nzContentParams: {
          value: 'Hello Node',
        },
      });

      drawerRef.afterOpen.subscribe(() => {
        console.log('Drawer(Template) open');
      });

      drawerRef.afterClose.subscribe(() => {
        console.log('Drawer(Template) close');
      }); */
    });

    this.graph.on('edge:mouseenter', ({ edge }) => {
      edge.addTools({
        name: 'button-remove',
      });
    });

    this.graph.on('edge:mouseleave', ({ edge }) => {
      edge.removeTools();
    });
  }
}
