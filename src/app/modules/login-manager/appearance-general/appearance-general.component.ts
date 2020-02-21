import { Component, OnInit } from '@angular/core';
import { BasePanelComponent } from '../base-panel.component';

@Component({
  selector: 'app-appearance-general',
  templateUrl: './appearance-general.component.html',
  styleUrls: ['./appearance-general.component.scss']
})
export class AppearanceGeneralComponent extends BasePanelComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {
  }

}
