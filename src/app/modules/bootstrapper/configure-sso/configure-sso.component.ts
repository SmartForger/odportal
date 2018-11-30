import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import {GlobalConfig} from '../../../models/global-config.model';
import {SsoConfigFormComponent} from '../../config-forms/sso-config-form/sso-config-form.component';

@Component({
  selector: 'app-configure-sso',
  templateUrl: './configure-sso.component.html',
  styleUrls: ['./configure-sso.component.scss']
})
export class ConfigureSsoComponent implements OnInit {

  @Output() configChanged: EventEmitter<GlobalConfig>;

  @ViewChild(SsoConfigFormComponent) configForm: SsoConfigFormComponent;

  constructor() { 
    this.configChanged = new EventEmitter<GlobalConfig>();
  }

  ngOnInit() {
  }

  formCreated(): void {
    let defaultConfig: GlobalConfig = {
      ssoConnection: "http://localhost:49100/",
      realm: "my-realm",
      realmDisplayName: "My Realm",
      publicClientName: "Default Public Client",
      publicClientId: "default-public-client",
      bearerClientName: "Default Bearer Client",
      bearerClientId: "default-bearer-client"
    };
    this.configForm.setForm(defaultConfig);
  }

  formSubmitted(config: GlobalConfig): void {
    this.configChanged.emit(config);
  }

}
