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
  }> = this.fb.group({
    label: ['', [Validators.required]],
    width: [0, [Validators.required]],
    height: [0, [Validators.required]],
    shape: ['rect', [Validators.required]],
    coordinateX: [0, [Validators.required]],
    coordinateY: [0, [Validators.required]],
  });

  constructor(
    private nodeService: NodeService,
    private fb: NonNullableFormBuilder
  ) {}

  onCreateNode() {
    console.log('submit', this.validateForm.value);
    const { shape, coordinateX, coordinateY, width, height, label } =
      this.validateForm.value;

    this.nodeService.createNode({
      id: crypto.randomUUID(),
      x: coordinateX as number,
      y: coordinateY as number,
      shape: shape as string,
      width: width as number,
      height: height as number,
      label: label as string,
    });
  }
}
