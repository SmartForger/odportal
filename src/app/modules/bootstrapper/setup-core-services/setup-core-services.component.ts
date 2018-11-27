import { Component, OnInit } from '@angular/core';
import {GlobalConfig} from '../../../models/global-config.model';

@Component({
  selector: 'app-setup-core-services',
  templateUrl: './setup-core-services.component.html',
  styleUrls: ['./setup-core-services.component.scss']
})
export class SetupCoreServicesComponent implements OnInit {

  constructor() { 
  }

  ngOnInit() {
  }

  formSubmitted(config: GlobalConfig): void {
    console.log(config);
  }


}
