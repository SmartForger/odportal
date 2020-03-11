import { Component, OnInit } from '@angular/core';
import { BasePanelComponent } from "../base-panel.component";
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";

@Component({
  selector: 'app-custom-css',
  templateUrl: './custom-css.component.html',
  styleUrls: ['./custom-css.component.scss']
})
export class CustomCssComponent extends BasePanelComponent
  implements OnInit {

  constructor(protected envConfigSvc: EnvironmentsServiceService) {
    super(envConfigSvc);
  }

  ngOnInit() {
  }

}
