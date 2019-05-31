import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  currentPanel = 2;
  currentStep = 2;
  formPanel = 1;

  constructor() { }

  ngOnInit() {
  }

}
