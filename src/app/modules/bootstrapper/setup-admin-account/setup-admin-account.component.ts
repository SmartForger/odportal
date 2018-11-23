import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-setup-admin-account',
  templateUrl: './setup-admin-account.component.html',
  styleUrls: ['./setup-admin-account.component.scss']
})
export class SetupAdminAccountComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      firstName: new FormControl ('', [Validators.required, Validators.maxLength(250)]),
      lastName: new FormControl ('', [Validators.required, Validators.maxLength(250)]),
      email: new FormControl ('', [Validators.required, Validators.maxLength(254), Validators.email]),
      username: new FormControl ('', [Validators.required, Validators.maxLength(250)]),
      password: new FormControl ('', [Validators.required ]),

    });
  }

}
