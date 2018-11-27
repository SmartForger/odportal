import { Component, OnInit } from '@angular/core';
import {GlobalConfig} from '../../../models/global-config.model';

@Component({
  selector: 'app-configure-sso',
  templateUrl: './configure-sso.component.html',
  styleUrls: ['./configure-sso.component.scss']
})
export class ConfigureSsoComponent implements OnInit {

  constructor() { 
  }

  ngOnInit() {
  }

  formSubmitted(config: GlobalConfig): void {
    console.log(config);
  }

}
