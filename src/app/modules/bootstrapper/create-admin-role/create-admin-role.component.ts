import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-admin-role',
  templateUrl: './create-admin-role.component.html',
  styleUrls: ['./create-admin-role.component.scss']
})
export class CreateAdminRoleComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: new FormControl ('', [Validators.required, Validators.maxLength(250)]),
      id: new FormControl ('', [Validators.required, Validators.maxLength(250)]),

      description: new FormControl ('', [Validators.required, Validators.maxLength(1000)]),

      impersonation: new FormControl (true),
      manageClients: new FormControl (true),
      realmAdmin: new FormControl (true),
      manageRealm: new FormControl (true),
      manageEvents: new FormControl (true),
      viewUsers: new FormControl (true),
      queryGroups: new FormControl (true),
      viewRealm: new FormControl (true),
      createClient: new FormControl (true),
      manageIdentityProviders: new FormControl (true),
      manageAuthorization: new FormControl (true),
      viewEvents: new FormControl (true),
      queryClients: new FormControl (true),
      queryUsers: new FormControl (true),
      queryRealms: new FormControl (true),
      viewAuthorization: new FormControl (true),
      manageUsers: new FormControl (true),
      viewClients: new FormControl (true),
      viewIdentityProviders: new FormControl (true),
      manageAccountLinks: new FormControl (true),
      manageAccount: new FormControl (true),
      viewProfile: new FormControl (true),
    });
  }

}
