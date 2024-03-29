import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  validateForm: FormGroup<{
    label: FormControl<string>;
    width: FormControl<number>;
    height: FormControl<number>;
    shape: FormControl<string>;
    coordinateX: FormControl<number>;
    coordinateY: FormControl<number>;
    id: FormControl<`${string}-${string}-${string}-${string}-${string}`>;
  }> = this.fb.group({
    label: ['', [Validators.required]],
    width: [0, [Validators.required]],
    height: [0, [Validators.required]],
    shape: ['', [Validators.required]],
    coordinateX: [0, [Validators.required]],
    coordinateY: [0, [Validators.required]],
    id: [crypto.randomUUID(), [Validators.required]],
  });

  constructor(
    private nodeService: NodeService,
    private fb: NonNullableFormBuilder
  ) {}

  onCreateNode() {
    console.log('submit', this.validateForm.value);
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
