import { Component, OnInit } from '@angular/core';
import { AdminCredentials } from '../../../models/admin-credentials.model';
import {ConfigService} from '../../../services/config.service';
import {RealmRepresentation} from '../../../models/realm-representation.model';
import {KeyValue} from '../../../models/key-value.model';

@Component({
  selector: 'app-choose-existing-realm',
  templateUrl: './choose-existing-realm.component.html',
  styleUrls: ['./choose-existing-realm.component.scss']
})
export class ChooseExistingRealmComponent implements OnInit {

  showCredsForm: boolean;
  showRealmPicker: boolean;
  realmOptions: Array<KeyValue>;

  selectedRealm: string;

  constructor(private configSvc: ConfigService) { 
    this.showCredsForm = true;
    this.showRealmPicker = false;
  }

  ngOnInit() {
  }

  credentialsSubmitted(creds: AdminCredentials): void {
    this.configSvc.listRealms(creds).subscribe(
      (realms: Array<RealmRepresentation>) => {
        this.realmOptions = realms.map((realm: RealmRepresentation) => {
          return {display: realm.realm, value: realm.realm};
        });
        this.showCredsForm = false;
        this.showRealmPicker = true;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  realmChanged(realm: string): void {
    this.selectedRealm = realm;
  }

}
