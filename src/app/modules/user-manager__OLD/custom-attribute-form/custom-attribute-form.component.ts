import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {CustomForm} from '../../../base-classes/custom-form';
import {KeyValue} from '../../../models/key-value.model';
import {FormControl, FormBuilder, Validators} from '@angular/forms';
import {SettableForm} from '../../../interfaces/settable-form';
import { MatDialogRef } from '@angular/material';
import { PlatformModalType } from 'src/app/models/platform-modal.model';

@Component({
  selector: 'app-custom-attribute-form',
  templateUrl: './custom-attribute-form.component.html',
  styleUrls: ['./custom-attribute-form.component.scss']
})
export class CustomAttributeFormComponent extends CustomForm implements OnInit, SettableForm {

  @Output() close: EventEmitter<void>;

  constructor(private formBuilder: FormBuilder, private dlgRef: MatDialogRef<CustomAttributeFormComponent>) { 
    super();
    this.close = new EventEmitter<void>();

    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);
  }

  ngOnInit() {
    this.buildForm();
  }

  setForm(kv: KeyValue): void {
    this.form.setValue({
      display: kv.display,
      value: kv.value
    });
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      display: new FormControl('', [Validators.required]),
      value: new FormControl('')
    });
  }

}
