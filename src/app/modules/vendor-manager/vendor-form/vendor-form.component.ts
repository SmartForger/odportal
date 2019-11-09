import { Component, OnInit, Input } from '@angular/core';
import {Vendor} from '../../../models/vendor.model';
import {CustomForm} from '../../../base-classes/custom-form';
import {SettableForm} from '../../../interfaces/settable-form';
import {FormControl, Validators, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.scss']
})
export class VendorFormComponent extends CustomForm implements OnInit, SettableForm {

  @Input() vendor: Vendor;
  @Input() canSave: boolean;

  constructor(private formBuilder: FormBuilder) { 
    super();
    this.canSave = true;
    this.btnText = '';
  }

  ngOnInit() {
    this.buildForm();
    if (this.vendor) {
      this.setForm(this.vendor);
    }
  }

  setForm(vendor: Vendor): void {
    this.form.setValue({
      name: vendor.name,
      pocPhone: vendor.pocPhone,
      pocEmail: vendor.pocEmail  || '',
      website: vendor.website || '',
      description: vendor.description || ''
    });
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      pocPhone: new FormControl('', [Validators.maxLength(255)]),
      pocEmail: new FormControl('', [Validators.maxLength(254), Validators.email]),
      website: new FormControl('', [Validators.maxLength(2048)]),
      description: new FormControl('', [Validators.maxLength(2000)])
    });
  }

  submitForm(vendor: Vendor): void {
    if(this.form.valid){
      if (this.vendor) {
        vendor.docId = this.vendor.docId;
        vendor.type = this.vendor.type;
        vendor.users = this.vendor.users;
      }
      this.formSubmitted.emit(vendor);
    }
  }

}
