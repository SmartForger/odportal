import { Component, OnInit, Input } from '@angular/core';
import { EnvConfig } from 'src/app/models/EnvConfig.model';

@Component({
  selector: 'app-environment-card',
  templateUrl: './environment-card.component.html',
  styleUrls: ['./environment-card.component.scss']
})
export class EnvironmentCardComponent implements OnInit {
  @Input() config: EnvConfig;
  @Input() isCurrent: boolean;

  readonly colors = {
    "unclassified": "#3B8553",
    "secret": "#A52115",
    "topsecret": "#C37429",
    "none": "#B5B5B5"
  };

  constructor() { }

  ngOnInit() {
  }

}
