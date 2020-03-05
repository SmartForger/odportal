import { Component, OnInit } from '@angular/core';
import { BasePanelComponent } from '../base-panel.component';
import { EnvironmentsServiceService } from 'src/app/services/environments-service.service';

@Component({
  selector: 'app-classification-banner',
  templateUrl: './classification-banner.component.html',
  styleUrls: ['./classification-banner.component.scss']
})
export class ClassificationBannerComponent extends BasePanelComponent implements OnInit {
  readonly colors = {
    "#04874D": "UNCLASSIFIED",
    "#CF7000": "SECRET",
    "#B40000": "TOP SECRET"
  };

  constructor(protected envConfigSvc: EnvironmentsServiceService) {
    super(envConfigSvc);
  }

  ngOnInit() {
  }

  get previewStyle() {
    return {
      backgroundColor: this.config.clsBannerColor,
      color: "#fff"
    }
  }

  get colorArray() {
    return Object.keys(this.colors);
  }
}
