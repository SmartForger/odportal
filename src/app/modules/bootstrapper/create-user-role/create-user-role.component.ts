import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-user-role',
  templateUrl: './create-user-role.component.html',
  styleUrls: ['./create-user-role.component.scss']
})
export class CreateUserRoleComponent implements OnInit {

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

      impersonation: new FormControl (false),
      manageClients: new FormControl (false),
      realmAdmin: new FormControl (false),
      manageRealm: new FormControl (false),
      manageEvents: new FormControl (false),
      viewUsers: new FormControl (true),
      queryGroups: new FormControl (false),
      viewRealm: new FormControl (false),
      createClient: new FormControl (false),
      manageIdentityProviders: new FormControl (false),
      manageAuthorization: new FormControl (false),
      viewEvents: new FormControl (false),
      queryClients: new FormControl (false),
      queryUsers: new FormControl (false),
      queryRealms: new FormControl (false),
      viewAuthorization: new FormControl (false),
      manageUsers: new FormControl (false),
      viewClients: new FormControl (false),
      viewIdentityProviders: new FormControl (false),
      manageAccountLinks: new FormControl (false),
      manageAccount: new FormControl (false),
      viewProfile: new FormControl (false),
    });
  }

}
