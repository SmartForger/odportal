import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {GlobalConfig} from '../../../models/global-config.model';

@Component({
  selector: 'app-setup-core-services',
  templateUrl: './setup-core-services.component.html',
  styleUrls: ['./setup-core-services.component.scss']
})
export class SetupCoreServicesComponent implements OnInit {

  @Output() configChanged: EventEmitter<GlobalConfig>;

  constructor() { 
    this.configChanged = new EventEmitter<GlobalConfig>();
  }

  ngOnInit() {
  }

  formSubmitted(config: GlobalConfig): void {
    this.configChanged.emit(config);
  }


}
