import { Component, OnInit } from '@angular/core';
import { BasePanelComponent } from '../base-panel.component';
import { EnvironmentsServiceService } from 'src/app/services/environments-service.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-appearance-general',
  templateUrl: './appearance-general.component.html',
  styleUrls: ['./appearance-general.component.scss']
})
export class AppearanceGeneralComponent extends BasePanelComponent implements OnInit {
  constructor(protected envConfigSvc: EnvironmentsServiceService) {
    super(envConfigSvc);
  }

  ngOnInit() {
  }

  handleUpdate() {
    this.handleFileUploads(['pageIcon', 'pageBackground']);
  }
}
