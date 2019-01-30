import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AdminCredentials } from '../../../models/admin-credentials.model';
import {ConfigService} from '../../../services/config.service';
import {RealmRepresentation} from '../../../models/realm-representation.model';
import {KeyValue} from '../../../models/key-value.model';
import {Client} from '../../../models/client.model';
import {RoleRepresentation} from '../../../models/role-representation.model';
import {GlobalConfig} from '../../../models/global-config.model';

@Component({
  selector: 'app-choose-existing-realm',
  templateUrl: './choose-existing-realm.component.html',
  styleUrls: ['./choose-existing-realm.component.scss']
})
export class ChooseExistingRealmComponent implements OnInit {

  showCredsForm: boolean;
  showRealmPicker: boolean;
  showClientPickers: boolean;
  showRolePickers: boolean;
  realms: Array<RealmRepresentation>;
  realmOptions: Array<KeyValue>;
  clients: Array<Client>;
  clientOptions: Array<KeyValue>;
  roles: Array<RoleRepresentation>;
  roleOptions: Array<KeyValue>;
  creds: AdminCredentials;
  showCredentialsError: boolean;

  selectedRealm: string;
  ssoURL: string;
  selectedPublicClient: string;
  selectedBearerClient: string;
  selectedAdminRole: string;
  selectedPendingRole: string;
  selectedApprovedRole: string;

  @Output() configChanged: EventEmitter<GlobalConfig>;

  constructor(private configSvc: ConfigService) { 
    this.initClientAndRoleValues();
    this.selectedRealm = "";
    this.ssoURL = "";
    this.showCredsForm = true;
    this.showRealmPicker = false;
    this.showClientPickers = false;
    this.showRolePickers = false;
    this.showCredentialsError = false;
    this.configChanged = new EventEmitter<GlobalConfig>();
  }

  ngOnInit() {
  }

  credentialsSubmitted(creds: AdminCredentials): void {
    this.creds = creds;
    this.configSvc.listRealms(creds).subscribe(
      (realms: Array<RealmRepresentation>) => {
        this.realms = realms;
        this.realmOptions = realms.map((realm: RealmRepresentation) => {
          return {display: realm.realm, value: realm.realm};
        });
        this.showCredsForm = false;
        this.showRealmPicker = true;
      },
      (err: any) => {
        console.log(err);
        this.showCredentialsError = true;
      }
    );
  }

  realmChanged(realm: string): void {
    this.selectedRealm = realm;
    this.listClients();
    this.listRoles();
    this.initClientAndRoleValues();
  }

  private initClientAndRoleValues(): void {
    this.selectedPublicClient = "";
    this.selectedBearerClient = "";
    this.selectedAdminRole = "";
    this.selectedPendingRole = "";
    this.selectedApprovedRole = "";
  }

  private listClients(): void {
    this.configSvc.listClients(this.creds, this.selectedRealm).subscribe(
      (clients: Array<Client>) => {
        this.clients = clients;
        this.clientOptions = clients.map((client: Client) => {
          return {display: client.clientId, value: client.clientId};
        });
        this.showClientPickers = true;
      },
      (err: any) => {
        console.log(err);
      }
    );  
  }

  private listRoles(): void {
    this.configSvc.listRoles(this.creds, this.selectedRealm).subscribe(
      (roles: Array<RoleRepresentation>) => {
        this.roles = roles;
        this.roleOptions = roles.map((role: RoleRepresentation) => {
          return {display: role.name, value: role.id};
        });
        this.showRolePickers = true;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  submit(): void {
    if (this.canSubmit()) {
      const config: GlobalConfig = {
        ssoConnection: this.ssoURL,
        realm: this.selectedRealm,
        realmDisplayName: this.realms.find((realm: RealmRepresentation) => realm.realm === this.selectedRealm).displayName,
        publicClientId: this.selectedPublicClient,
        publicClientName: this.selectedPublicClient,
        bearerClientId: this.selectedBearerClient,
        bearerClientName: this.selectedBearerClient,
        pendingRoleId: this.selectedPendingRole,
        pendingRoleName: this.findRoleName(this.selectedPendingRole),
        approvedRoleId: this.selectedApprovedRole,
        approvedRoleName: this.findRoleName(this.selectedApprovedRole),
        administratorRoleId: this.selectedAdminRole,
        administratorRoleName: this.findRoleName(this.selectedAdminRole)
      };
      this.configChanged.emit(config);
    }
  }

  private findRoleName(id: string): string {
    return this.roles.find((role: RoleRepresentation) => role.id === id).name;
  }

  private canSubmit(): boolean {
    return (
      this.ssoURL.length > 0 && 
      this.selectedRealm.length > 0 && 
      this.selectedPublicClient.length > 0 && 
      this.selectedBearerClient.length > 0 &&
      this.selectedPendingRole.length > 0 &&
      this.selectedAdminRole.length > 0 &&
      this.selectedApprovedRole.length > 0);
  }

}
