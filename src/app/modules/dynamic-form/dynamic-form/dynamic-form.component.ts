import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import {
  DynamicForm,
  DynamicFormRow,
  DynamicFormField
} from '../../../models/dynamic-form';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Input() data: DynamicForm = null;

  form: FormGroup = new FormGroup({});

  constructor() {}

  ngOnInit() {
    if (this.data) {
      this.data.layout.rows.forEach((row: DynamicFormRow) => {
        row.columns.forEach((col: { field: DynamicFormField }) => {
          const { field } = col;
          if (
            field.type === 'radio' &&
            field.attributes &&
            typeof field.attributes.default === 'number' &&
            field.attributes.options[field.attributes.default - 1]
          ) {
            this.form.addControl(
              field.binding,
              new FormControl(
                field.attributes.options[field.attributes.default - 1].value
              )
            );
          } else if (field.attributes) {
            this.form.addControl(
              field.binding,
              new FormControl(field.attributes.default)
            );
          } else {
            this.form.addControl(field.binding, new FormControl());
          }
        });
      });
    }
  }
}
