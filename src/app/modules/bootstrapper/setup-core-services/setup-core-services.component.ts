import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import {GlobalConfig} from '../../../models/global-config.model';
import {CoreServicesConfigFormComponent} from '../../config-forms/core-services-config-form/core-services-config-form.component';

@Component({
  selector: 'app-setup-core-services',
  templateUrl: './setup-core-services.component.html',
  styleUrls: ['./setup-core-services.component.scss']
})
export class SetupCoreServicesComponent implements OnInit {

  @Output() configChanged: EventEmitter<GlobalConfig>;

  @ViewChild(CoreServicesConfigFormComponent) configForm: CoreServicesConfigFormComponent;

  constructor() { 
    this.configChanged = new EventEmitter<GlobalConfig>();
  }

  ngOnInit() {
  }

  formSubmitted(config: GlobalConfig): void {
    this.configChanged.emit(config);
  }

  formCreated(): void {
    let defaultConfig: GlobalConfig = {
      vendorsServiceConnection: "http://localhost:49107/",
      rolesServiceConnection: "http://localhost:49113/",
      usersServiceConnection: "http://localhost:49119/",
      appsServiceConnection: "http://localhost:49125/",
      widgetsServiceConnection: "http://localhost:49131/",
      servicesServiceConnection: "http://localhost:49137/"
    };
    this.configForm.setForm(defaultConfig);
  }


}
