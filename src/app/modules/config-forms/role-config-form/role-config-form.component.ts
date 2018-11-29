import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import {CustomForm} from '../../../base-classes/custom-form';
import {RoleRepresentation} from '../../../models/role-representation.model';
import {Formatters} from '../../../util/formatters';
import {SettableForm} from '../../../interfaces/settable-form';
import {BiMap} from '../../../util/bi-map';

@Component({
  selector: 'app-role-config-form',
  templateUrl: './role-config-form.component.html',
  styleUrls: ['./role-config-form.component.scss']
})
export class RoleConfigFormComponent extends CustomForm implements OnInit, SettableForm {

  private readonly accountRoleMapper: BiMap<string, string>;
  private realmRoleMapper: BiMap<string, string>;

  constructor(private formBuilder: FormBuilder) { 
    super();
    this.realmRoleMapper = new BiMap<string, string>();
    this.realmRoleMapper.add('impersonation', 'impersonation');
    this.realmRoleMapper.add('manageClients', 'manage-clients');
    this.realmRoleMapper.add('realmAdmin', 'realm-admin');
    this.realmRoleMapper.add('manageRealm', 'manage-realm');
    this.realmRoleMapper.add('manageEvents', 'manage-events');
    this.realmRoleMapper.add('viewUsers', 'view-users');
    this.realmRoleMapper.add('queryGroups', 'query-groups');
    this.realmRoleMapper.add('viewRealm', 'view-realm');
    this.realmRoleMapper.add('createClient', 'create-client');
    this.realmRoleMapper.add('manageIdentityProviders', 'manage-identity-providers');
    this.realmRoleMapper.add('manageAuthorization', 'manage-authorization');
    this.realmRoleMapper.add('viewEvents', 'view-events');
    this.realmRoleMapper.add('queryClients', 'query-clients');
    this.realmRoleMapper.add('queryUsers', 'query-users');
    this.realmRoleMapper.add('queryRealms', 'query-realms');
    this.realmRoleMapper.add('viewAuthorization', 'view-authorization');
    this.realmRoleMapper.add('manageUsers', 'manage-users');
    this.realmRoleMapper.add('viewClients', 'view-clients');
    this.realmRoleMapper.add('viewIdentityProviders', 'view-identity-providers');

    this.accountRoleMapper = new BiMap<string, string>();
    this.accountRoleMapper.add('manageAccountLinks', 'manage-account-links');
    this.accountRoleMapper.add('manageAccount', 'manage-account');
    this.accountRoleMapper.add('viewProfile', 'view-profile');
  }

  ngOnInit() {
    this.buildForm();
  }

  setForm(role: RoleRepresentation): void {
    this.form.patchValue({
      name: role.name,
      id: role.id,
      description: role.description
    });
    this.setActiveRoles(this.realmRoleMapper, role.realmRoles);
    this.setActiveRoles(this.accountRoleMapper, role.accountRoles);
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      name: new FormControl ('', [Validators.required, Validators.maxLength(250)]),
      id: new FormControl ('', [Validators.required, Validators.maxLength(250)]),
      description: new FormControl ('', [Validators.required, Validators.maxLength(1000)]),
      impersonation: new FormControl (false),
      manageClients: new FormControl (false),
      realmAdmin: new FormControl (false),
      manageRealm: new FormControl (false),
      manageEvents: new FormControl (false),
      viewUsers: new FormControl (false),
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
      viewProfile: new FormControl (false)
    });
    this.formCreated.emit();
  }

  adminRoleNameChanged(name: string): void {
    this.form.get('id').setValue(Formatters.formatStringToId(name));
  }

  submitForm(): void {
    let role: RoleRepresentation = {
      name: this.form.get('name').value,
      id: this.form.get('id').value,
      description: this.form.get('description').value,
      realmRoles: this.generateRealmRoleArray(),
      accountRoles: this.generateAccountRoleArray()
    };
    this.formSubmitted.emit(role);
  }

  private setActiveRoles(roleMapper: BiMap<string, string>, roles: Array<string>): void {
    roles.forEach((role: string) => {
      let value: string = roleMapper.findByValue(role);
      this.form.get(value).setValue(true);
    });
  }

  private generateRealmRoleArray(): Array<string> {
    let roles: Array<string> = new Array<string>();
    Object.keys(this.form.controls).forEach((key: string) => {
      if (key !== 'name' && key !== 'id' && key !== 'description' && key !== 'manageAccountLinks' && key !== 'manageAccount' && key !== 'viewProfile' && this.form.get(key).value) {
        roles.push(this.realmRoleMapper.findByKey(key));
      }
    });
    return roles;
  }

  private generateAccountRoleArray(): Array<string> {
    let roles: Array<string> = new Array<string>();
    if (this.form.get('manageAccountLinks').value) {
      roles.push(this.accountRoleMapper.findByKey('manageAccountLinks'));
    }
    if (this.form.get('manageAccount').value) {
      roles.push(this.accountRoleMapper.findByKey('manageAccount'));
    }
    if (this.form.get('viewProfile').value) {
      roles.push(this.accountRoleMapper.findByKey('viewProfile'));
    }
    return roles;
  }

}
