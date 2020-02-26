import { Component, OnInit } from '@angular/core';
import { BasePanelComponent } from '../base-panel.component';
import { EnvironmentsServiceService } from 'src/app/services/environments-service.service';

@Component({
  selector: 'app-config-general',
  templateUrl: './config-general.component.html',
  styleUrls: ['./config-general.component.scss']
})
export class ConfigGeneralComponent extends BasePanelComponent implements OnInit {
  readonly classifications = {
    "unclassified": {
      label: "UNCLASSIFIED",
      color: "#04874D"
    },
    "secret": {
      label: "SECRET",
      color: "#CF7000"
    },
    "topsecret": {
      label: "TOP SECRET",
      color: "#B40000"
    }
  }

  constructor(protected envConfigSvc: EnvironmentsServiceService) {
    super(envConfigSvc);
  }

  ngOnInit() {
  }

  get classificationsArray() {
    return Object.keys(this.classifications);
  }

}
