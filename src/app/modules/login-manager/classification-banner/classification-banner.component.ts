import { Component, OnInit } from '@angular/core';
import { BasePanelComponent } from '../base-panel.component';

@Component({
  selector: 'app-classification-banner',
  templateUrl: './classification-banner.component.html',
  styleUrls: ['./classification-banner.component.scss']
})
export class ClassificationBannerComponent extends BasePanelComponent implements OnInit {
  readonly colors = {
    "#04874D": "Green",
    "#CF7000": "Orange",
    "#B40000": "Red"
  };

  constructor() {
    super();
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
