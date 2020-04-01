import { Component, OnInit } from '@angular/core';
import { BasePanelComponent } from '../base-panel.component';
import { EnvironmentsServiceService } from 'src/app/services/environments-service.service';

@Component({
  selector: 'app-info-banner',
  templateUrl: './info-banner.component.html',
  styleUrls: ['./info-banner.component.scss']
})
export class InfoBannerComponent extends BasePanelComponent implements OnInit {
  rcsOptions = ["RCS01", "RCS03", "RCS05", "RCS07"];

  readonly colors = {
    "#8D0C2B": "Magenta",
    "#5E15AD": "Purple",
    "#154688": "Blue",
    "#2F2F2F": "Smoke",
    "#039957": "Green"
  };
  readonly icons = {
    settings: "Platform",
    update: "Update",
    flag: "Flag",
    notifications: "Notification",
    star: "Star"
  };


  constructor(protected envConfigSvc: EnvironmentsServiceService) {
    super(envConfigSvc);
  }

  ngOnInit() {
  }

  get previewStyle() {
    return {
      backgroundColor: this.config.infoBannerColor,
      color: "#fff"
    }
  }

  get colorArray() {
    return Object.keys(this.colors);
  }

  get iconsArray() {
    return Object.keys(this.icons);
  }
}
