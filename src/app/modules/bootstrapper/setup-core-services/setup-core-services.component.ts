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
    const defaultConfig: GlobalConfig = {
      vendorsServiceConnection: "http://docker.emf360.com:49107/",
      appsServiceConnection: "http://docker.emf360.com:49113/",
      widgetsServiceConnection: "http://docker.emf360.com:49119/",
      servicesServiceConnection: "http://docker.emf360.com:49125/"
    };
    this.configForm.setForm(defaultConfig);
  }


}
