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
        row.columns.fields.forEach((field: DynamicFormField) => {
          this.form.addControl(
            field.binding,
            new FormControl(field.defaultValue)
          );
        });
      });
    }
  }
}
