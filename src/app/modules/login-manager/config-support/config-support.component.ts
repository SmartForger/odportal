import { Component, OnInit } from '@angular/core';
import { BasePanelComponent } from "../base-panel.component";
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";

@Component({
  selector: 'app-config-support',
  templateUrl: './config-support.component.html',
  styleUrls: ['./config-support.component.scss']
})
export class ConfigSupportComponent extends BasePanelComponent
  implements OnInit {

  constructor(
    protected envConfigSvc: EnvironmentsServiceService
  ) {
    super(envConfigSvc);
  }

  ngOnInit() {
  }
}
