import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import {GlobalConfig} from '../../../models/global-config.model';
import {SsoConfigFormComponent} from '../sso-config-form/sso-config-form.component';

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
    const defaultConfig: GlobalConfig = {
      ssoConnection: "https://docker.emf360.com:49100/",
      realm: "my-realm",
      realmDisplayName: "My Realm",
      publicClientName: "OpenDash 360 Public",
      publicClientId: "opendash360-public",
      bearerClientName: "OpenDash 360 Bearer",
      bearerClientId: "opendash360-bearer"
    };
    this.configForm.setForm(defaultConfig);
  }

  formSubmitted(config: GlobalConfig): void {
    this.configChanged.emit(config);
  }

}
