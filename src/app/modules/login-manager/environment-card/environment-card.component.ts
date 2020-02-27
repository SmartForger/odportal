import { Component, OnInit, Input } from '@angular/core';
import { EnvConfig } from 'src/app/models/EnvConfig.model';

@Component({
  selector: 'app-environment-card',
  templateUrl: './environment-card.component.html',
  styleUrls: ['./environment-card.component.scss']
})
export class EnvironmentCardComponent implements OnInit {
  @Input() config: EnvConfig;
  readonly colors = {
    "unclassified": "#04874D",
    "secret": "#CF7000",
    "topsecret": "#B40000"
  };

  constructor() { }

  ngOnInit() {
  }

}
