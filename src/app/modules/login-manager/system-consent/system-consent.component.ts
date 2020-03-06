import { Component, OnInit } from '@angular/core';
import { BasePanelComponent } from "../base-panel.component";
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";

@Component({
  selector: 'app-system-consent',
  templateUrl: './system-consent.component.html',
  styleUrls: ['./system-consent.component.scss']
})
export class SystemConsentComponent extends BasePanelComponent
  implements OnInit {

  constructor(protected envConfigSvc: EnvironmentsServiceService) {
    super(envConfigSvc);
  }

  ngOnInit() {
  }

}
