import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-setup-core-services',
  templateUrl: './setup-core-services.component.html',
  styleUrls: ['./setup-core-services.component.scss']
})
export class SetupCoreServicesComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      vendorService: new FormControl ('', [Validators.required, Validators.maxLength(250)]),

    });
  }

}
