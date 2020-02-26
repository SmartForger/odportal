import { Component, OnInit } from '@angular/core';
import { BasePanelComponent } from '../base-panel.component';
import { EnvironmentsServiceService } from 'src/app/services/environments-service.service';

@Component({
  selector: 'app-smtp-relay',
  templateUrl: './smtp-relay.component.html',
  styleUrls: ['./smtp-relay.component.scss']
})
export class SmtpRelayComponent extends BasePanelComponent implements OnInit {

  constructor(protected envConfigSvc: EnvironmentsServiceService) {
    super(envConfigSvc);
  }

  ngOnInit() {
  }

}
