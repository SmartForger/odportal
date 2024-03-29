import { Component, OnInit } from '@angular/core';
import { BasePanelComponent } from '../base-panel.component';
import { EnvironmentsServiceService } from 'src/app/services/environments-service.service';

@Component({
  selector: 'app-landing-text',
  templateUrl: './landing-text.component.html',
  styleUrls: ['./landing-text.component.scss']
})
export class LandingTextComponent extends BasePanelComponent implements OnInit {
  constructor(protected envConfigSvc: EnvironmentsServiceService) {
    super(envConfigSvc);
  }

  ngOnInit() {
  }

  handleUpdate() {
    this.handleFileUploads(['introIconFile']);
  }
}
