import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {GlobalConfig} from '../../../models/global-config.model';

@Component({
  selector: 'app-configure-sso',
  templateUrl: './configure-sso.component.html',
  styleUrls: ['./configure-sso.component.scss']
})
export class ConfigureSsoComponent implements OnInit {

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
