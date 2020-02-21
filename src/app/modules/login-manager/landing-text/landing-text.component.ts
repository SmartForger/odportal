import { Component, OnInit } from '@angular/core';
import { BasePanelComponent } from '../base-panel.component';

@Component({
  selector: 'app-landing-text',
  templateUrl: './landing-text.component.html',
  styleUrls: ['./landing-text.component.scss']
})
export class LandingTextComponent extends BasePanelComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {
  }

}
