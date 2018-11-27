import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import {CustomForm} from '../../../base-classes/custom-form';
import {RoleRepresentation} from '../../../models/role-representation.model';
import {Util} from '../../../util';

@Component({
  selector: 'app-role-config-form',
  templateUrl: './role-config-form.component.html',
  styleUrls: ['./role-config-form.component.scss']
})
export class RoleConfigFormComponent extends CustomForm implements OnInit {

  private readonly realmRoleMapper: Map<string, string>;
  private readonly accountRoleMapper: Map<string, string>;

  constructor(private formBuilder: FormBuilder) { 
    super();
    this.realmRoleMapper = new Map<string, string>();
    this.realmRoleMapper.set('impersonation', 'impersonation');
    this.realmRoleMapper.set('manageClients', 'manage-clients');
    this.realmRoleMapper.set('realmAdmin', 'realm-admin');
    this.realmRoleMapper.set('manageRealm', 'manage-realm');
    this.realmRoleMapper.set('manageEvents', 'manage-events');
    this.realmRoleMapper.set('viewUsers', 'view-users');
    this.realmRoleMapper.set('queryGroups', 'query-groups');
    this.realmRoleMapper.set('viewRealm', 'view-realm');
    this.realmRoleMapper.set('createClient', 'create-client');
    this.realmRoleMapper.set('manageIdentityProviders', 'manage-identity-providers');
    this.realmRoleMapper.set('manageAuthorization', 'manage-authorization');
    this.realmRoleMapper.set('viewEvents', 'view-events');
    this.realmRoleMapper.set('queryClients', 'query-clients');
    this.realmRoleMapper.set('queryUsers', 'query-users');
    this.realmRoleMapper.set('queryRealms', 'query-realms');
    this.realmRoleMapper.set('viewAuthorization', 'view-authorization');
    this.realmRoleMapper.set('manageUsers', 'manage-users');
    this.realmRoleMapper.set('viewClients', 'view-clients');
    this.realmRoleMapper.set('viewIdentityProviders', 'view-identity-providers');

    this.accountRoleMapper = new Map<string, string>();
    this.accountRoleMapper.set('manageAccountLinks', 'manage-account-links');
    this.accountRoleMapper.set('manageAccount', 'manage-account');
    this.accountRoleMapper.set('viewProfile', 'view-profile');
  }

  ngOnInit() {
    this.buildForm();
  }

  protected buildForm(): void {
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

  adminRoleNameChanged(name: string): void {
    this.form.get('id').setValue(Util.formatStringToId(name));
  }

  submitForm(data: Object): void {
    let role: RoleRepresentation = {
      name: this.form.get('name').value,
      id: this.form.get('id').value,
      description: this.form.get('description').value,
      realmRoles: this.generateRealmRoleArray(),
      accountRoles: this.generateAccountRoleArray()
    };
    this.formSubmitted.emit(role);
  }

  private generateRealmRoleArray(): Array<string> {
    let roles: Array<string> = new Array<string>();
    Object.keys(this.form.controls).forEach((key: string) => {
      if (key !== 'name' && key !== 'id' && key !== 'description' && key !== 'manageAccountLinks' && key !== 'manageAccount' && key !== 'viewProfile' && this.form.get(key).value) {
        roles.push(this.realmRoleMapper.get(key));
      }
    });
    return roles;
  }

  private generateAccountRoleArray(): Array<string> {
    let roles: Array<string> = new Array<string>();
    if (this.form.get('manageAccountLinks').value) {
      roles.push(this.accountRoleMapper.get('manageAccountLinks'));
    }
    if (this.form.get('manageAccount').value) {
      roles.push(this.accountRoleMapper.get('manageAccount'));
    }
    if (this.form.get('viewProfile').value) {
      roles.push(this.accountRoleMapper.get('viewProfile'));
    }
    return roles;
  }

}
