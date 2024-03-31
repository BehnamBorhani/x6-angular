import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-node',
  templateUrl: './custom-node.component.html',
  styleUrls: ['./custom-node.component.scss'],
})
export class CustomNodeComponent {
  @Input() value: string = "No Value";
}
