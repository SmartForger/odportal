import { Component, OnInit, Input } from '@angular/core';
import { App } from 'src/app/models/app.model';

@Component({
  selector: 'app-microapp-card',
  templateUrl: './microapp-card.component.html',
  styleUrls: ['./microapp-card.component.scss']
})
export class MicroappCardComponent implements OnInit {
  @Input() app: App;
  @Input() vendors: Object;

  constructor() {
    this.app = {
      appTitle: '',
      enabled: false,
      native: false,
      clientId: '',
      clientName: ''
    };
    this.vendors = {};
  }

  ngOnInit() {
  }

}
