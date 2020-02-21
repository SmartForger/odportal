import { Component, OnInit } from '@angular/core';
import { BasePanelComponent } from '../base-panel.component';

@Component({
  selector: 'app-info-banner',
  templateUrl: './info-banner.component.html',
  styleUrls: ['./info-banner.component.scss']
})
export class InfoBannerComponent extends BasePanelComponent implements OnInit {
  rcsOptions = ["RCS01", "RCS03", "RCS05", "RCS07"];

  readonly colors = {
    "#04874D": "Green",
    "#CF7000": "Orange",
    "#B40000": "Red"
  };
  readonly icons = {
    info: "Info",
    notification_important: "Notification",
    warning: "Warning",
    error: "Error"
  }


  constructor() {
    super();
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
