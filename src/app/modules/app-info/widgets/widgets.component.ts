import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit {

  @Input() app: App;

  constructor() { }

  ngOnInit() {
  }

}